import type Stripe from "stripe";
import { env } from "~/env";

import { stripe } from "./config.server";

export type CreateStripeCheckoutSession = {
  customerEmail?: string;
  customerId?: string;
  metadata?: Record<string, any>;
  priceId?: string;
  lookupKey?: string;
  successUrl?: string;
  cancelUrl?: string;
  mode: "subscription" | "payment";
};

export const createCheckoutSession = async ({
  customerId,
  customerEmail,
  priceId,
  lookupKey,
  cancelUrl,
  successUrl,
  mode,
  metadata,
}: CreateStripeCheckoutSession) => {
  if (lookupKey && !priceId) {
    const prices = await stripe.prices.list({
      lookup_keys: [lookupKey],
      expand: ["data.product"],
    });
    priceId = prices.data[0].id;
  }
  let params: Stripe.Checkout.SessionCreateParams = {
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: mode,
    success_url: successUrl
      ? `${env.APP_URL}${successUrl}`
      : `${env.APP_URL}/success`,
    cancel_url: cancelUrl
      ? `${env.APP_URL}${cancelUrl}`
      : `${env.APP_URL}/cancel`,
    metadata,
    subscription_data: {
      metadata,
    },
  };
  if (customerId) {
    params.customer = customerId;
  } else if (customerEmail) {
    params.customer_email = customerEmail;
  } else {
    throw new Error("Must provide either customerId or customerEmail");
  }
  const session = await stripe.checkout.sessions.create(params);
  return session;
};
