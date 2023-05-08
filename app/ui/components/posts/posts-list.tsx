import { useEffect, useState } from "react";
import { PostPreview, type TPostPreview } from "./post-preview";
import { useFetcher } from "@remix-run/react";
import { AuthenticityTokenInput } from "remix-utils";
import { cn } from "~/ui/utils";

import { Button } from "~/ui/components";

export type PostsListProps = {
  posts: TPostPreview[];
  pagination?: { page: number; pages: number; next: number | null };
  primaryAuthor?: string;
  primaryTag?: string;
  className?: string;
};

export const PostsList = ({
  posts,
  pagination = { page: 1, pages: 1, next: null },
  primaryAuthor,
  primaryTag,
  className,
}: PostsListProps) => {
  const [page, setPage] = useState<number>(pagination.page);
  const [next, setNext] = useState<number | null>(pagination.next);
  const [morePosts, setMorePosts] = useState<TPostPreview[]>([]);
  const paginate = useFetcher();

  useEffect(() => {
    if (paginate.state === "idle" && paginate.data && paginate.data.posts) {
      setMorePosts((prev) => [...prev, ...paginate.data.posts]);
      setPage(paginate.data.pagination.page);
      setNext(paginate.data.pagination.next);
    }
  }, [paginate.state, paginate.data]);

  return (
    <div
      className={cn(
        "flex flex-col text-slate-800 dark:text-slate-100",
        className
      )}
    >
      {posts.map((post) => (
        <PostPreview post={post} key={post.id} />
      ))}
      {morePosts.map((post) => (
        <PostPreview post={post} key={post.id} />
      ))}
      {next && next > page && (
        <paginate.Form
          method="POST"
          action="/blog/load-more-posts"
          preventScrollReset={true}
          className="my-4 w-full"
        >
          <AuthenticityTokenInput />
          <input type="hidden" name="page" value={page} />
          <input type="hidden" name="next" value={next} />
          <input type="hidden" name="pages" value={pagination.pages} />
          {primaryAuthor && (
            <>
              <input type="hidden" name="primaryAuthor" value={primaryAuthor} />
              <input type="hidden" name="context" value="author" />
            </>
          )}
          {primaryTag && (
            <>
              <input type="hidden" name="primaryTag" value={primaryTag} />
              <input type="hidden" name="context" value="tag" />
            </>
          )}
          <Button
            type="submit"
            name="page"
            value={next}
            className="w-full"
            variant={"outline"}
            disabled={paginate.state !== "idle"}
          >
            {paginate.state !== "idle" ? "Loading..." : "Load More"}
          </Button>
        </paginate.Form>
      )}
    </div>
  );
};
