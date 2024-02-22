import { json, type ActionFunctionArgs } from "@remix-run/node";
import { TSGhostContentAPI } from "@ts-ghost/content-api";
import invariant from "tiny-invariant";
import { env } from "~/env";
import { csrf } from "~/services/csrf.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.clone().formData();
  // CSRF Protection
  await csrf.validate(formData, request.headers);
  const page = parseInt(formData.get("page") as string);
  const next = parseInt(formData.get("next") as string);
  const pages = parseInt(formData.get("pages") as string);
  const context = formData.get("context") as "tag" | "author";
  if (next <= page || next > pages) {
    return json({});
  }
  const api = new TSGhostContentAPI(
    env.GHOST_URL,
    env.GHOST_CONTENT_API_KEY,
    "v5.0"
  );
  switch (context) {
    case "tag":
      const primaryTag = formData.get("primaryTag") as string;
      invariant(primaryTag && primaryTag.length > 0, "primaryTag is required");
      const addTagPosts = await api.posts
        .browse({ limit: 10, page: next, filter: `primary_tag:${primaryTag}` })
        .include({ tags: true, authors: true })
        .fetch();
      if (addTagPosts.success) {
        return json({
          posts: addTagPosts.data,
          pagination: addTagPosts.meta.pagination,
        });
      }
      break;
    case "author":
      const primaryAuthor = formData.get("primaryAuthor") as string;
      invariant(
        primaryAuthor && primaryAuthor.length > 0,
        "primaryAuthor is required"
      );
      const addAuthorPosts = await api.posts
        .browse({
          limit: 10,
          page: next,
          filter: `primary_author:${primaryAuthor}`,
        })
        .include({ tags: true, authors: true })
        .fetch();
      if (addAuthorPosts.success) {
        return json({
          posts: addAuthorPosts.data,
          pagination: addAuthorPosts.meta.pagination,
        });
      }
      break;
    default:
      const addPosts = await api.posts
        .browse({ limit: 10, page: next })
        .include({ tags: true, authors: true })
        .fetch();
      if (addPosts.success) {
        return json({
          posts: addPosts.data,
          pagination: addPosts.meta.pagination,
        });
      }
      break;
  }
  
}