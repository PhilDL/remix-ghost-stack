import { Tag } from "./tag";
import { Link } from "@remix-run/react";
import type { Tag as TTag } from "@ts-ghost/content-api";
import { ArrowRight } from "lucide-react";

export type TagsSectionProps = {
  className?: string;
  tags: TTag[];
};

export const TagsSection = ({ className, tags }: TagsSectionProps) => {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-slate-600 dark:text-slate-100">
          Explore topics
        </h2>
        <Link
          to="/tags"
          className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          View All <ArrowRight className="inline h-4" />
        </Link>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${className} gap-3 lg:grid-cols-4`}
      >
        {tags.map((tag) => (
          <Tag tag={tag} key={tag.url} />
        ))}
      </div>
    </section>
  );
};
