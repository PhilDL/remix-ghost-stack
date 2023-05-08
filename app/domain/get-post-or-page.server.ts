import type { RenderableTreeNodes } from "@markdoc/markdoc";
import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import { TSGhostContentAPI } from "@ts-ghost/content-api";
import { makeDomainFunction } from "domain-functions";
import { rehype } from "rehype";
import rehypePrism from "rehype-prism-plus";
import invariant from "tiny-invariant";
import * as z from "zod";
import { env } from "~/env";

import { getMemberActiveSubscriptions } from "../services/ghost.server";
import {
  convertPostToMarkdown,
  membersContentParser,
  parseMarkdown,
} from "~/services/markdoc/markdown.server";

export const inputGetPostOrPage = z.object({
  transform: z.union([z.literal("html"), z.literal("markdoc")]),
  slug: z.string().nonempty(),
});

export const optionalUser = z
  .object({
    id: z.string().nonempty(),
  })
  .nullable();

export const getPostOrPage = makeDomainFunction(
  inputGetPostOrPage,
  optionalUser
)(async ({ transform, slug }, optionalUser) => {
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  const admin = new TSGhostAdminAPI(
    env.GHOST_URL,
    env.GHOST_ADMIN_API_KEY,
    "v5.0"
  );
  const [postQuery, pageQuery, featuredPostsQuery, latestPostsQuery] =
    await Promise.all([
      admin.posts
        .read({ slug })
        .include({ tags: true, authors: true, tiers: true })
        .formats({ html: true })
        .fetch(),
      admin.pages
        .read({ slug })
        .include({ tags: true, authors: true, tiers: true })
        .formats({ html: true })
        .fetch(),
      api.posts
        .browse({ limit: 5, filter: `featured:true+slug:-${slug}` })
        .fields({
          title: true,
          slug: true,
          feature_image: true,
          published_at: true,
        })
        .fetch(),
      api.posts
        .browse({ limit: 3, filter: `featured:false+slug:-${slug}` })
        .fields({
          title: true,
          slug: true,
          feature_image: true,
          published_at: true,
        })
        .fetch(),
    ]);
  if (!postQuery.success && !pageQuery.success) {
    throw new Error("Post or page not found");
  }
  const post = postQuery.success
    ? postQuery.data
    : pageQuery.success
    ? pageQuery.data
    : undefined;
  invariant(featuredPostsQuery.success, "Failed to fetch featured posts");
  invariant(latestPostsQuery.success, "Failed to fetch latest posts");
  const [featuredPosts, latestPosts] = [
    featuredPostsQuery.data,
    latestPostsQuery.data,
  ];
  invariant(post, "Post or page not found");
  let restricted = post.visibility !== "public";

  switch (post.visibility) {
    case "members":
      restricted = !optionalUser;
      break;
    case "paid":
      if (!optionalUser) {
        restricted = true;
      } else {
        const subscriptions = await getMemberActiveSubscriptions(
          optionalUser.id
        );
        if (
          subscriptions.length > 0 &&
          post.tiers?.filter((tier) =>
            subscriptions.map((s) => s.tier?.slug).includes(tier.slug)
          )
        ) {
          restricted = false;
        } else {
          restricted = true;
        }
      }
      break;
    default:
      break;
  }
  let content: string | RenderableTreeNodes | undefined = "";
  switch (transform) {
    case "html":
      let outputHtml = membersContentParser(post.html, {
        membersOnlyContent: !restricted,
      });
      content = rehype()
        .use(rehypePrism, { showLineNumbers: true, ignoreMissing: true })
        .processSync(outputHtml)
        .toString() as string;
      break;

    case "markdoc":
      content = parseMarkdown(
        convertPostToMarkdown(post, { membersOnlyContent: !restricted })
      );
      break;
  }
  return {
    post,
    content,
    featuredPosts,
    latestPosts,
    restricted,
    user: optionalUser,
    transform,
  };
});
