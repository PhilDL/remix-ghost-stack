import { json, type LoaderFunctionArgs } from "@remix-run/node";

import {
  cachedCmdAllAuthors,
  cachedCmdAllPosts,
  cachedCmdAllTags,
} from "~/services/ghost.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const search = url.searchParams.get("search");
  switch (search) {
    case "tags":
      const tags = await cachedCmdAllTags();
      return json(
        {
          success: true,
          tags,
        },
        200
      );
    case "authors":
      const authors = await cachedCmdAllAuthors();
      return json(
        {
          success: true,
          authors,
        },
        200
      );
    case "posts":
      const posts = await cachedCmdAllPosts();
      return json(
        {
          success: true,
          posts,
        },
        200
      );
    default:
      break;
  }
  return json({ success: true }, 200);
};
