import { Tag } from "./tag";
import type { Tag as TTag } from "@ts-ghost/content-api";
import { ArrowRight } from "lucide-react";

import { LinkButton } from "~/ui/components";

export type TagsSectionProps = {
  className?: string;
  tags: TTag[];
};

export const TagsSection = ({ className, tags }: TagsSectionProps) => {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold">
          Popular tags{" "}
          <LinkButton to="/tags" variant={"link"}>
            View All <ArrowRight className="inline h-4" />
          </LinkButton>
        </h2>
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
