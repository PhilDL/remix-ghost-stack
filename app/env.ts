import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  clientPrefix: "PUBLIC_",
  server: {
    GHOST_URL: z.string().min(1),
    GHOST_CONTENT_API_KEY: z.string().min(1),
    GHOST_ADMIN_API_KEY: z.string().min(1),
    MAGIC_LINK_SECRET: z.string().min(1),
    SESSION_SECRET: z.string().min(1),
    STRIPE_PUBLIC_KEY: z.string().optional(),
    STRIPE_SECRET_KEY: z.string().min(1),
    STRIPE_WEBHOOK_SIGNATURE: z.string().min(1),
    SENDGRID_API_KEY: z.string().optional(),
    MAILGUN_API_KEY: z.string().optional(),
    MAILGUN_DOMAIN: z.string().optional(),
    APP_URL: z.string().min(1),
  },
  client: {},
  runtimeEnv: process.env,
});
