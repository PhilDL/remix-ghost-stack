import { Badge } from "../badge";
import { Link } from "@remix-run/react";
import type { Tag as TTag } from "@ts-ghost/content-api";

export type TagProps = {
  tag: TTag;
};

export const Tag = ({ tag }: TagProps) => {
  return (
    <Link
      to={`/tag/${tag.slug}`}
      className="flex flex-col items-center gap-1 rounded p-4 pt-2"
      style={{ backgroundColor: tag.accent_color || "#fff" }}
    >
      <div className="flex w-full items-start justify-between">
        <span className="rounded-md bg-white p-3 text-sm font-semibold text-slate-900 dark:bg-slate-950 dark:text-slate-50">
          {tag.name}
        </span>
        <Badge>{tag.count?.posts} articles</Badge>
      </div>

      <img
        src={tag.feature_image || "/images/ghost-logo.png"}
        alt={tag.name}
        className="max-h-32 sm:h-32 sm:w-32"
      />
    </Link>
  );
};
