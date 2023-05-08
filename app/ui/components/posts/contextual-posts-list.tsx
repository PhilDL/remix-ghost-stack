import { Link } from "@remix-run/react";
import { ghostImage } from "~/ui/utils";

import { BoxedContent } from "~/ui/components/boxed-content";
import { PublishedAt } from "~/ui/components/published-at";

export type ContextualPostsListProps = {
  className?: string;
  posts: {
    slug: string;
    title: string;
    published_at?: string | null;
    feature_image: string | null;
  }[];
  title: string;
};

export const ContextualPostsList = ({
  className,
  posts,
  title,
}: ContextualPostsListProps) => {
  return (
    <BoxedContent className={className}>
      <BoxedContent.BoxedContentTitle as="div">
        {title}
      </BoxedContent.BoxedContentTitle>
      <BoxedContent.BoxedContentBody>
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/${post.slug}`}
            className="group flex flex-row gap-2 py-4 hover:bg-slate-50 dark:hover:bg-slate-900 lg:px-4"
          >
            <div
              className="h-20 w-20 rounded bg-cover bg-center"
              style={{
                backgroundImage: `url("${ghostImage(
                  post.feature_image || "",
                  200
                )}")`,
              }}
            ></div>
            <div className="flex flex-1 flex-col justify-between gap-2">
              <h3 className="text-md font-bold text-accent-foreground group-hover:text-link">
                {post.title}
              </h3>
              <PublishedAt date={post.published_at || ""} />
            </div>
          </Link>
        ))}
      </BoxedContent.BoxedContentBody>
    </BoxedContent>
  );
};
