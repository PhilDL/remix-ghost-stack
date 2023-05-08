import { Link } from "@remix-run/react";
import type { Tag as TTag } from "@ts-ghost/content-api";

export type TagProps = {
  tag: TTag;
};

export const Tag = ({ tag }: TagProps) => {
  return (
    <Link
      to={`/tag/${tag.slug}`}
      className="flex flex-col items-center gap-9 rounded p-4 pt-10"
      style={{ backgroundColor: tag.accent_color || "#fff" }}
    >
      <img
        src={tag.feature_image || "/images/ghost-logo.png"}
        alt={tag.name}
        className="sm:h-40 sm:w-40"
      />
      <div className="flex w-full justify-between rounded bg-white p-3 text-slate-900 dark:bg-slate-950 dark:text-slate-50">
        <span className="text-sm font-semibold">{tag.name}</span>
        <span className="text-sm font-semibold">{tag.count?.posts}+</span>
      </div>
    </Link>
  );
};
