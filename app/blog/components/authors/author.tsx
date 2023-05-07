import { Link } from "@remix-run/react";
import type { Author as TAuthor } from "@ts-ghost/content-api";

export const Author = ({ author }: { author: TAuthor }) => {
  return (
    <div className="flex flex-col items-center rounded border border-slate-200 dark:border-slate-800">
      <div className="rounded-t bg-gradient-to-br from-cornflower-500 to-pink-500 px-6 py-24">
        <img src={author.cover_image ?? ""} alt={author.name} />
      </div>
      <Link to={`/authors/${author.slug}`} className="-mt-14">
        <img
          src={author.profile_image ?? ""}
          alt={author.name}
          className="w-24"
        />
      </Link>
      <div className="flex flex-col gap-3 p-4">
        <Link
          to={author.slug}
          className="text-slate-700 hover:text-cornflower-500 dark:text-slate-200"
        >
          <h3 className="text-center text-lg  font-bold">{author.name}</h3>
        </Link>
        <p className="text-slate-500 dark:text-slate-300">{author.bio}</p>
        <div className="flex flex-row justify-between">
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {author.count?.posts} posts
          </span>
          <div>Social links</div>
        </div>
      </div>
    </div>
  );
};
