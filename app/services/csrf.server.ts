// app/utils/csrf.server.ts
import { createCookie } from "@remix-run/node"; // or cloudflare/deno
import { CSRF } from "remix-utils/csrf/server";

import { env } from "~/env";

const cookie = createCookie("csrf", {
  path: "/",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  secrets: [env.ADMIN_SESSION_SECRET],
});

export const csrf = new CSRF({
  cookie,
  // what key in FormData objects will be used for the token, defaults to `csrf`
  formDataKey: "csrf",
  // an optional secret used to sign the token, recommended for extra safety
  secret: env.ADMIN_SESSION_SECRET,
});
