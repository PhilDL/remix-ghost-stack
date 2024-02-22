import type { LoaderFunctionArgs } from "@remix-run/server-runtime";

export let loader = async ({ request }: LoaderFunctionArgs) => {
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
