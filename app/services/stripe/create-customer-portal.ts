import { env } from "~/env";

import { stripe } from "./config.server";

export async function createStripeCustomerPortalSession(customerId: string) {
  if (!customerId)
    throw new Error(
      "Missing required parameters to create Stripe Customer Portal."
    );

  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${env.APP_URL}/account`,
  });
  if (!session?.url)
    throw new Error("Unable to create Stripe Customer Portal Session.");

  return session.url;
}
