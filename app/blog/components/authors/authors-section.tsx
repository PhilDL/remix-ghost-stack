import { Author } from "./author";
import { Link } from "@remix-run/react";
import type { Author as TAuthor } from "@ts-ghost/content-api";
import { ArrowRight } from "react-feather";

export type AuthorsSectionProps = {
  className?: string;
  authors: TAuthor[];
};

export const AuthorsSection = ({ className, authors }: AuthorsSectionProps) => {
  return (
    <section className={`flex flex-col gap-4 ${className}`}>
      <div className="flex flex-row items-center justify-between">
        <h2 className="text-xl font-bold text-slate-600 dark:text-slate-100">
          Authors
        </h2>
        <Link
          to="/authors"
          className="rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
        >
          View All <ArrowRight className="inline h-4" />
        </Link>
      </div>
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 ${className} gap-3 lg:grid-cols-3`}
      >
        {authors.map((author) => (
          <Author author={author} key={author.slug} />
        ))}
      </div>
    </section>
  );
};
