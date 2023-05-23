import {
  json,
  redirect,
  type ActionFunction,
  type LoaderFunction,
} from "@remix-run/node";
import { isTheme } from "~/ui/utils/theme-provider";

import { getAllTags } from "~/services/ghost.server";
import { getThemeSession } from "~/ui/utils/theme.server";

export const action: ActionFunction = async ({ request }) => {
  const themeSession = await getThemeSession(request);
  const requestText = await request.text();
  const form = new URLSearchParams(requestText);
  const search = form.get("search");
  switch (search) {
    case "tags":
      const { tags } = await getAllTags();
      return json({
        success: true,
        tags: tags.map((tag) => ({
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
        })),
      });
    case "default":
      break;
  }
  return json({ success: true });
};

export const loader: LoaderFunction = () => redirect("/", { status: 404 });
