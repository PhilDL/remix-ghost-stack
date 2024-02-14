import { json, type LoaderArgs, type V2_MetaFunction } from "@remix-run/node";
import {
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import type { loader as rootBlogLoader } from "~/routes/_blog";
import { ArrowLeft } from "lucide-react";
import type { CreativeWorkSeries } from "schema-dts";
import invariant from "tiny-invariant";

import { LinkButton } from "~/ui/components";
import { PostsList } from "~/ui/components/posts/posts-list";

import { getTagPage } from "~/services/ghost.server";

export const meta: V2_MetaFunction<
  typeof loader,
  { "routes/_blog": typeof rootBlogLoader }
> = ({ data, matches, location, params }) => {
  if (!data) {
    return [];
  }
  const { tag } = data;
  const settings = matches.find((match) => match.id === "routes/_blog")?.data
    .settings;

  const SeriesSchemaLDJSON: CreativeWorkSeries = {
    "@type": "CreativeWorkSeries",
    publisher: {
      "@type": "Organization",
      name: settings?.meta_title || settings?.title || "",
      url: settings?.url || "",
      logo: {
        "@type": "ImageObject",
        url: settings?.logo || "",
      },
    },
    url: tag.url || "",
    image: {
      "@type": "ImageObject",
      url: tag.feature_image || "",
      width: "1920",
      height: "1080",
    },
    description:
      tag.meta_description || tag.og_description || tag.description || "",
    mainEntityOfPage: tag.url,
  };

  return [
    { title: tag.meta_title || tag.og_title || tag.name },
    {
      tagName: "link",
      rel: "canonical",
      href: tag.url || "",
    },
    {
      name: "description",
      content: tag.meta_description || tag.og_description || tag.description,
    },
    {
      property: "og:site_name",
      content: settings?.meta_title || settings?.title,
    },
    { property: "og:type", content: "article" },
    {
      property: "og:title",
      content: tag.og_title || tag.meta_title || tag.name,
    },
    {
      property: "og:description",
      content: tag.og_description || tag.meta_description,
    },
    { property: "og:url", content: tag.url },
    {
      property: "og:image",
      content: tag.og_image || tag.feature_image,
    },
    {
      name: "article:publisher",
      content: settings?.facebook || settings?.twitter || settings?.url,
    },
    { name: "twitter:card", content: "summary_large_image" },
    {
      name: "twitter:title",
      content: tag.twitter_title || tag.meta_title || tag.name,
    },
    {
      name: "twitter:description",
      content:
        tag.twitter_description || tag.meta_description || tag.description,
    },
    { name: "twitter:url", content: tag.url },
    {
      name: "twitter:image",
      content: tag.twitter_image || tag.og_image || tag.feature_image,
    },
    { "twitter:site": settings?.twitter || "" },
    { property: "og:image:width", content: "350" },
    { property: "og:image:height", content: "450" },
    {
      "script:ld+json": {
        "@context": "https://schema.org",
        ...SeriesSchemaLDJSON,
      },
    },
  ];
};

export async function loader({ request, params }: LoaderArgs) {
  let slug = params.slug;
  invariant(slug, "Slug is required");
  const { posts, tag, postsMeta } = await getTagPage(slug);
  return json({
    posts,
    tag,
    pagination: postsMeta.pagination,
  });
}

export default function Index() {
  const { posts, tag, pagination } = useLoaderData<typeof loader>();
  return (
    <main className="relative flex min-h-screen flex-col gap-6">
      <div className="mt-16 flex w-full max-w-5xl flex-row justify-start gap-3">
        <img
          src={tag.feature_image || "/images/ghost-logo.png"}
          alt={tag.name}
          className="rounded-md sm:h-32 sm:w-32"
        />
        <div>
          <h1 className="text-3xl font-semibold">{tag.name}</h1>
          <p className="text-muted-foreground">{tag.description}</p>
        </div>
      </div>
      <PostsList
        posts={posts}
        pagination={pagination}
        primaryTag={tag.slug}
        className="max-w-5xl"
      />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  // when true, this is what used to go to `CatchBoundary`
  if (isRouteErrorResponse(error)) {
    return (
      <div className="relative overflow-hidden py-16">
        <div className="relative px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-prose text-lg">
            <h1>
              <span className="block text-lg font-semibold text-muted-foreground">
                Error
              </span>
              <span className="mt-2 block text-3xl font-bold leading-8 tracking-tight text-primary sm:text-4xl">
                {error.status} {error.statusText}
              </span>
            </h1>

            <pre className="mt-8 overflow-auto rounded-md border-2 border-gray-400 p-8 text-sm leading-8 text-muted-foreground">
              <code>{error.data}</code>
            </pre>
            <LinkButton to="/tags" variant={"outline"} className="mt-8">
              <ArrowLeft className="mr-2 h-4 w-4" /> All tags
            </LinkButton>
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
    <div className="relative overflow-hidden py-16">
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-prose text-lg">
          <h1>
            <span className="block text-center text-lg font-semibold text-primary">
              Uh oh...
            </span>
          </h1>
          <pre className="mt-8 overflow-auto rounded-md border-2 border-input text-sm leading-8 text-muted-foreground">
            <code>{errorMessage}</code>
          </pre>
          Butt
        </div>
      </div>
    </div>
  );
}
