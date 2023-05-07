import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import { Star } from "lucide-react";
import type { Article } from "schema-dts";
import type { loader as rootBlogLoader } from "~/routes/_blog";

import { ContextualPostsList } from "~/blog/components/posts/contextual-posts-list";
import { PostSubscribeCTA } from "~/blog/components/primitives/subscribe-overlay";
import { Markdown } from "~/markdoc/components/markdown";
import { LinkButton } from "~/ui/components";

import { getPostOrPage } from "~/blog/domain/get-post-or-page.server";
import { auth } from "~/blog/services/auth.server";

export const meta: V2_MetaFunction<
  typeof loader,
  { "routes/_blog": typeof rootBlogLoader }
> = ({ data, matches, location, params }) => {
  if (!data) {
    return [];
  }
  const { post } = data;
  const settings = matches.find((match) => match.id === "routes/_blog")?.data
    .settings;
  const tags = (post.tags || [])
    .filter((t) => t.visibility === "public")
    .map((tag) => {
      return { property: "article:tag", content: tag.name };
    });
  const keywords = (post.tags || [])
    .filter((tag) => tag.visibility === "public")
    .join(", ");

  const ArticleSchemaLDJSON: Article = {
    "@type": "Article",
    publisher: {
      "@type": "Organization",
      name: settings?.meta_title || settings?.title || "",
      url: settings?.url || "",
      logo: {
        "@type": "ImageObject",
        url: settings?.logo || "",
      },
    },
    author: {
      "@type": "Person",
      name: post.primary_author?.name ?? "",
      image: {
        "@type": "ImageObject",
        url: post.primary_author?.profile_image ?? "",
        width: "311",
        height: "311",
      },
      url: post.primary_author?.url ?? "",
      sameAs: [
        post.primary_author?.website ?? "",
        post.primary_author?.facebook ?? "",
        post.primary_author?.twitter ?? "",
      ],
    },
    headline: post.meta_title || post.title,
    url: post.url || "",
    datePublished: post.published_at || "",
    dateModified: post.updated_at || "",
    image: {
      "@type": "ImageObject",
      url: post.feature_image || "",
      width: "1920",
      height: "1080",
    },
    keywords: keywords,
    description:
      post.meta_description || post.custom_excerpt || post.excerpt || "",
    mainEntityOfPage: post.url,
  };

  return [
    { charset: "utf-8" },
    { title: post.meta_title || post.title },
    {
      tagName: "link",
      rel: "canonical",
      href: post.url || "",
    },
    { name: "viewport", content: "width=device-width,initial-scale=1" },
    {
      name: "description",
      content: post.meta_description || post.excerpt,
    },
    {
      property: "og:site_name",
      content: settings?.meta_title || settings?.title,
    },
    { property: "og:type", content: "article" },
    {
      property: "og:title",
      content: post.og_title || post.meta_title || post.title,
    },
    {
      property: "og:description",
      content: post.og_description || post.meta_description,
    },
    { property: "og:url", content: post.url },
    {
      property: "og:image",
      content: post.og_image || post.feature_image,
    },
    {
      property: "article:published_time",
      content: post.published_at,
    },
    {
      property: "article:modified_time",
      content: post.updated_at,
    },
    ...tags,
    {
      name: "article:publisher",
      content: post.primary_author?.facebook || post.primary_author?.twitter,
    },
    {
      name: "article:author",
      content: post.primary_author?.facebook || post.primary_author?.twitter,
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: post.twitter_title || post.meta_title || post.title,
    },
    {
      name: "twitter:description",
      content:
        post.twitter_description ||
        post.meta_description ||
        post.custom_excerpt,
    },
    { name: "twitter:url", content: post.url },
    {
      name: "twitter:image",
      content: post.twitter_image || post.og_image || post.feature_image,
    },
    { "twitter:site": post.primary_author?.twitter || "" },
    { property: "og:image:width", content: "486" },
    { property: "og:image:height", content: "269" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        ...ArticleSchemaLDJSON,
      },
    },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  const res = await getPostOrPage(
    {
      slug: params.slug,
      transform: "html", 
      // you can also ask for the markdown version
    } as const,
    await auth.isAuthenticated(request)
  );
  if (!res.success) {
    console.error(res);
    throw new Response(
      "Something went wrong! We can't seem to find the page you are looking for.",
      {
        status: 404,
        statusText: "Post not found",
      }
    );
  }
  return json(res.data);
}

export default function PostOrPage() {
  const {
    post,
    user,
    content,
    featuredPosts,
    latestPosts,
    restricted,
    transform,
  } = useLoaderData<typeof loader>();
  const publishedDate = new Date(post.published_at ?? "");
  return (
    <>
      <main className="lg:container lg:mx-auto">
        <div className="relative border-t border-slate-200 py-6 dark:border-slate-800 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-prose flex-col gap-4 text-lg">
            <span className="text-md flex flex-row items-center justify-center gap-2 text-center text-slate-500 dark:text-slate-400">
              {publishedDate.toLocaleDateString("en-GB", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}{" "}
              <span className="text-slate-300">•</span> {post.reading_time} min
              read{" "}
              {post.featured && (
                <Star
                  className="inline-flex text-saffron-400"
                  fill={"rgb(246 203 104)"}
                />
              )}
            </span>
            <h1 className="mt-2 block text-center text-3xl font-bold leading-8 tracking-tight text-slate-900 dark:text-slate-100 sm:text-4xl">
              {post.title}
            </h1>
            {post.primary_author && (
              <div className="flex items-center justify-center gap-3 text-center text-sm font-semibold text-slate-500 dark:text-slate-400">
                <img
                  src={post.primary_author.profile_image ?? ""}
                  alt={post.primary_author.name}
                  className="w-8 "
                />{" "}
                {post.primary_author.name}
              </div>
            )}

            <div className="text-center">
              <img
                src={post.feature_image ?? ""}
                className="w-full rounded-md"
                alt={post.title}
              />
            </div>
          </div>
          <div className="prose-md prose prose-slate relative mx-auto mt-6 break-words dark:prose-invert prose-pre:text-sm prose-pre:leading-6 dark:text-slate-300">
            {post.custom_excerpt && (
              <p className="text-md mt-8 leading-8 text-slate-700 dark:text-slate-400">
                {post.custom_excerpt}
              </p>
            )}
            {transform === "html" ? (
              <article
                dangerouslySetInnerHTML={{ __html: content as string }}
              />
            ) : (
              <Markdown content={content} />
            )}
            {restricted === true && (
              <PostSubscribeCTA>
                <div className="text-2xl font-semibold">
                  Read the full article
                </div>
                <p className="text-sm text-muted-foreground">
                  {user ? "Upgrade to a premium membership" : "Sign up"} now to
                  read the full article and get access to all {post.visibility}{" "}
                  posts.
                </p>
                {user ? (
                  <LinkButton
                    to="/account"
                    variant={"codingdodo"}
                    className="no-underline"
                  >
                    UPGRADE
                  </LinkButton>
                ) : (
                  <>
                    <LinkButton
                      to="/signup"
                      variant={"codingdodo"}
                      className="no-underline"
                    >
                      SUBSCRIBE
                    </LinkButton>
                    <small className="mt-4">
                      Already have an account?{" "}
                      <LinkButton to="/login" variant={"link"} size={"sm"}>
                        Sign in
                      </LinkButton>
                    </small>
                  </>
                )}
              </PostSubscribeCTA>
            )}
          </div>
        </div>
      </main>
      <div className="my-8 flex flex-col gap-8">
        <ContextualPostsList posts={featuredPosts} title="Featured Posts" />
        <ContextualPostsList posts={latestPosts} title="Latest Posts" />
      </div>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative h-[60%] overflow-hidden bg-white py-16">
        <div className="relative h-full px-4 sm:px-6 lg:px-8">
          <div className="mx-auto flex h-full max-w-prose flex-col gap-6">
            <h1>
              <span className="block text-center text-3xl font-bold leading-8 tracking-tight sm:text-4xl">
                {error.status} {error.statusText || ""}
              </span>
            </h1>
            <p className="text-md mt-8 text-center text-muted-foreground">
              {error.data}
            </p>

            <div className="flex flex-row items-center justify-center">
              <LinkButton to="/" variant={"default"}>
                Go back home
              </LinkButton>
            </div>
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
            <span className="block text-center text-2xl font-semibold">
              Internal Error
            </span>
          </h1>

          <pre className="mt-8 overflow-auto rounded-md border-2 border-slate-400 bg-white text-sm leading-8 text-slate-800">
            <code>{errorMessage}</code>
          </pre>
        </div>
      </div>
    </div>
  );
}
