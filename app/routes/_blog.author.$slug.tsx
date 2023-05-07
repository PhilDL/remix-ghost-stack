import { json, type LoaderArgs } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import invariant from "tiny-invariant";

import { Hero } from "~/blog/components/layout/hero";
import { PostsList } from "~/blog/components/posts/posts-list";

import { getAuthorPage } from "~/blog/services/ghost.server";

export async function loader({ request, params }: LoaderArgs) {
  let slug = params.slug;
  invariant(slug, "Slug is required");
  const { posts, author, postsMeta } = await getAuthorPage(slug);
  return json({
    posts,
    author,
    pagination: postsMeta.pagination,
  });
}

export default function Index() {
  const { posts, author, pagination } = useLoaderData<typeof loader>();
  return (
    <main className="relative flex min-h-screen flex-col gap-6">
      <Hero title={`${author.name}`} description={author.bio ?? ""} />
      <PostsList
        posts={posts}
        pagination={pagination}
        primaryAuthor={author.slug}
        className="mx-auto max-w-5xl"
      />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative overflow-hidden bg-white py-16">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <h1>
              <span className="block text-center text-lg font-semibold text-cornflower-600">
                Error
              </span>
              <span className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
                {error.status}
              </span>
            </h1>

            <pre className="mt-8 overflow-auto rounded-md border-2 border-gray-400 bg-white text-sm leading-8 text-gray-800">
              <code>{error.data.message}</code>
            </pre>
          </div>
        </div>
      </div>
    );
  }

  // Don't forget to typecheck with your own logic.
  // Any value can be thrown, not just errors!
  let errorMessage = "Unknown error";
  if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="relative overflow-hidden bg-white py-16">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg">
          <h1>
            <span className="block text-center text-lg font-semibold text-cornflower-600">
              Uh oh...
            </span>
          </h1>

          <pre className="mt-8 overflow-auto rounded-md border-2 border-gray-400 bg-white text-sm leading-8 text-gray-800">
            <code>{errorMessage}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
