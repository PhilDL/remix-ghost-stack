import type { LoaderArgs } from "@remix-run/server-runtime";

export let loader = async ({ request }: LoaderArgs) => {
  const robotText = `
User-agent: *
Disallow: /`;
  return new Response(robotText, {
    status: 200,
    headers: {
      "Content-Type": "text/plain",
    },
  });
};
