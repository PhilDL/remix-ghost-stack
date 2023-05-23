import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";

import {
  cachedCmdAllAuthors,
  cachedCmdAllPosts,
  cachedCmdAllTags,
} from "~/services/ghost.server";

/**
 * action routes prefixed by action like this one are excluded from
 * revalidation.
 */
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const search = form.get("search");
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
