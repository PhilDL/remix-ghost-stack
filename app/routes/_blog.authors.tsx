import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

import { AuthorsSection } from "~/ui/components/authors/authors-section";

import { auth } from "~/services/auth.server";
import { getAllAuthors } from "~/services/ghost.server";

export async function loader({ request }: LoaderArgs) {
  const user = await auth.isAuthenticated(request);
  const { authors } = await getAllAuthors();
  return json({
    user,
    authors,
  });
}

export default function Authors() {
  const { authors } = useLoaderData<typeof loader>();
  return (
    <main className="relative flex min-h-screen flex-col gap-6">
      <AuthorsSection authors={authors} className="my-6" />
    </main>
  );
}
