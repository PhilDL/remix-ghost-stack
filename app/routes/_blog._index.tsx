import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AuthorsSection } from "~/blog/components/authors/authors-section";
import { Hero } from "~/blog/components/layout/hero";
import { SiteDescription } from "~/blog/components/layout/site-description";
import { ContextualPostsList } from "~/blog/components/posts/contextual-posts-list";
import { PostsList } from "~/blog/components/posts/posts-list";
import { TagsSection } from "~/blog/components/tags/tags-section";

import { auth } from "~/blog/services/auth.server";
import { cachedGetIndexPageData } from "~/blog/services/ghost.server";

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
        title={`Sign up to ${settings.title}!`}
        description={settings.description}
        showForm={true}
        image={settings.cover_image ?? undefined}
      />
      <div className="flex flex-col gap-8 lg:flex lg:flex-row">
        <PostsList posts={posts} pagination={pagination} />
        <aside className="flex flex-col gap-8 lg:max-w-[25%] lg:flex-col">
          <SiteDescription
            settings={settings}
            className="lg:mt-8"
            titleElement={(user && "h1") || "div"}
          />
          <ContextualPostsList posts={featuredPosts} title="Featured Posts" />
        </aside>
      </div>

      <AuthorsSection authors={authors} />
      <TagsSection tags={tags} className="my-6" />
    </main>
  );
}
