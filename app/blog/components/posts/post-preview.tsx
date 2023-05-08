import { Link } from "@remix-run/react";
import type { Post } from "@ts-ghost/content-api";

import { Excerpt } from "~/blog/components/primitives/excerpt";
import { PublishedAt } from "~/blog/components/primitives/published-at";
import { Badge } from "~/ui/components";
import { AspectRatio } from "~/ui/components/aspect-ratio";
import { GhostImage } from "~/ui/components/ghost-image";

export type TPostPreview = Pick<
  Post,
  | "id"
  | "title"
  | "reading_time"
  | "published_at"
  | "feature_image"
  | "primary_author"
  | "primary_tag"
  | "excerpt"
  | "custom_excerpt"
  | "slug"
>;

export const PostPreview = ({ post }: { post: TPostPreview }) => {
  return (
    <div className="flex gap-4 py-8">
      <Link
        to={`/${post.slug}`}
        className="flex w-[150px] max-w-[300px] flex-1"
      >
        <AspectRatio ratio={4 / 3}>
          <GhostImage
            size={300}
            src={post.feature_image || ""}
            className="h-[100px] w-full md:h-[200px]"
            alt={post.title}
          />
        </AspectRatio>
      </Link>
      <div className="flex flex-1 grow-[2] flex-col gap-0.5 md:gap-2">
        <div className="text-slate-300">
          {post.primary_tag && (
            <Link to={`/tag/${post.primary_tag.slug}`}>
              <Badge>{post.primary_tag.name}</Badge>
            </Link>
          )}{" "}
          •{" "}
          <span className="text-sm text-slate-500 dark:text-slate-400">
            {post.reading_time} min read
          </span>
        </div>
        <Link
          to={`/${post.slug}`}
          className="group mb-1 text-slate-900 dark:text-slate-100 md:mb-0"
        >
          <h2 className="font-bold text-slate-900 group-hover:text-blue-800  dark:text-slate-100 lg:text-2xl">
            {post.title}
          </h2>
        </Link>
        <Excerpt
          excerpt={post.excerpt}
          custom_excerpt={post.custom_excerpt}
          className="hidden md:block"
        />
        {post.primary_author && (
          <Link
            to={`/author/${post.primary_author.slug}`}
            className="group flex justify-self-end"
          >
            <img
              src={post.primary_author.profile_image || ""}
              className="h-8 w-8 rounded-full"
              alt={post.primary_author.name}
            />
            <div className="flex flex-col">
              <span className="ml-2 text-xs font-bold text-slate-500 group-hover:text-blue-800 dark:text-slate-400">
                {post.primary_author.name}
              </span>
              <PublishedAt date={post.published_at || ""} className="ml-2" />
            </div>
          </Link>
        )}
      </div>
    </div>
  );
};
