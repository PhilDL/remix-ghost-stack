import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { TagsSection } from "~/ui/components/tags/tags-section";

import { auth } from "~/services/auth.server";
import { getAllTags } from "~/services/ghost.server";

export async function loader({ request }: LoaderArgs) {
  const user = await auth.isAuthenticated(request);
  const { tags } = await getAllTags();
  return json({
    user,
    tags,
  });
}

export default function Tags() {
  const { tags } = useLoaderData<typeof loader>();
  return (
    <main className="relative flex min-h-screen flex-col gap-6">
      <TagsSection tags={tags} className="my-6" />
    </main>
  );
}
