import { Link } from "@remix-run/react";
import type { Author as TAuthor } from "@ts-ghost/content-api";

import { Card, CardContent, CardFooter, CardHeader } from "~/ui/components";
import { Excerpt } from "~/ui/components/excerpt";
import { SocialLinks } from "~/ui/components/social-links";

export const Author = ({ author }: { author: TAuthor }) => {
  // you have access to the author's cover_image also if you want to display it
  // in this preview
  return (
    <Card className="flex flex-col justify-around">
      {/* <div className="w-full px-6 py-24">
        {author.cover_image && (
          <img src={author.cover_image ?? ""} alt={author.name} />
        )}
      </div> */}
      <CardHeader className="flex flex-row justify-start gap-2">
        <Link to={`/author/${author.slug}`}>
          <img
            src={author.profile_image ?? ""}
            alt={author.name}
            className="w-16 rounded-md"
          />
        </Link>
        <Link to={`/author/${author.slug}`} className="hover:text-link">
          <h3 className="text-center text-lg  font-bold">{author.name}</h3>
          <span className="font-semibold text-slate-500 dark:text-slate-400">
            {author.count?.posts} posts
          </span>
        </Link>
      </CardHeader>
      <CardContent className="flex-1">
        <Excerpt excerpt={author.bio || ""} />
      </CardContent>
      <CardFooter>
        <SocialLinks
          className="flext-start flex flex-row gap-1"
          facebook={author.facebook || undefined}
          twitter={author.twitter || undefined}
          github={author.website || undefined}
        />
      </CardFooter>
    </Card>
  );
};
