import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AuthorsSection } from "~/ui/components/authors/authors-section";
import BoxedContent from "~/ui/components/boxed-content";
import { Hero } from "~/ui/components/layout/hero";
import { SiteDescription } from "~/ui/components/layout/site-description";
import { ContextualPostsList } from "~/ui/components/posts/contextual-posts-list";
import { PostsList } from "~/ui/components/posts/posts-list";
import { SocialLinks } from "~/ui/components/social-links";
import { TagsSection } from "~/ui/components/tags/tags-section";

import { auth } from "~/services/auth.server";
import { cachedGetIndexPageData } from "~/services/ghost.server";

export async function loader({ request }: LoaderArgs) {
  const user = await auth.isAuthenticated(request);
  const { settings, posts, tags, featuredPosts, authors, postsMeta } =
    await cachedGetIndexPageData();
  const pagination = postsMeta.pagination;
  return json({
    user,
    settings,
    posts,
    tags,
    featuredPosts,
    authors,
    pagination,
  });
}

export default function Index() {
  const { user, settings, posts, tags, featuredPosts, authors, pagination } =
    useLoaderData<typeof loader>();
  return (
    <main className="relative flex min-h-screen flex-col gap-6">
      <Hero
        title={settings.title}
        description={settings.description}
        showForm={true}
        image={settings.cover_image ?? undefined}
      />
      <div className="flex flex-col gap-8 lg:flex lg:flex-row">
        <PostsList posts={posts} pagination={pagination} />
        <aside className="flex flex-col gap-8 border border-card lg:min-w-[25%] lg:max-w-[25%] lg:flex-col xl:min-w-[25%]">
          <SiteDescription
            settings={settings}
            className="lg:mt-8"
            titleElement={(user && "h1") || "div"}
          />
          <ContextualPostsList posts={featuredPosts} title="Featured Posts" />
          <BoxedContent>
            <BoxedContent.BoxedContentTitle as={"h4"}>
              Follow us on social media
            </BoxedContent.BoxedContentTitle>
            <BoxedContent.BoxedContentBody className="gap-4 divide-none p-4">
              <SocialLinks
                className="flex justify-start gap-2"
                facebook="#"
                twitter="#"
                linkedin="#"
                github="#"
                rss="#"
              />
            </BoxedContent.BoxedContentBody>
          </BoxedContent>
        </aside>
      </div>

      <AuthorsSection authors={authors} />
      <TagsSection tags={tags} className="my-6" />
    </main>
  );
}
