// Required for an enhanced experience with Stripe Event Types.
// More info: https://bit.ly/3KlNXLs
/// <reference types="stripe-event-types" />
import { json, type DataFunctionArgs } from "@remix-run/node";
import { TSGhostAdminAPI } from "@ts-ghost/admin-api";
import type { Stripe } from "stripe";
import invariant from "tiny-invariant";
import { env } from "~/env";

import { stripe } from "~/services/stripe/config.server";

/**
 * Gets Stripe event signature from request header.
 */
async function getStripeEvent(request: Request) {
  try {
    // Get header Stripe signature.
    const signature = request.headers.get("stripe-signature");
    if (!signature) throw new Error("Missing Stripe signature.");

    // const ENDPOINT_SECRET =
    //   process.env.NODE_ENV === "development"
    //     ? process.env.DEV_STRIPE_WEBHOOK_ENDPOINT
    //     : process.env.PROD_STRIPE_WEBHOOK_ENDPOINT;

    const payload = await request.text();
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      env.STRIPE_WEBHOOK_SIGNATURE
    ) as Stripe.DiscriminatedEvent;

    return event;
  } catch (err: unknown) {
    console.log(err);
    return json({}, { status: 400 });
  }
}

export async function action({ request }: DataFunctionArgs) {
  const event = await getStripeEvent(request);

  try {
    switch (event.type) {
      // Occurs when a Checkout Session has been successfully completed.
      case "checkout.session.completed": {
        const session = event.data.object;
        console.log("checkout.session.completed", session);
        const customerId = String(session.customer);
        const customerEmail = String(session.customer_email);

        const api = new TSGhostAdminAPI(
          env.GHOST_URL,
          env.GHOST_ADMIN_API_KEY,
          "v5.0"
        );
        let userQuery = await api.members
          .browse({ filter: `email:${customerEmail}` })
          .fetch();
        invariant(userQuery.success, "Failed to fetch user");
        if (userQuery.data.length === 0) {
          throw new Error("User not found");
        }
        const ghostUser = userQuery.data[0];
        const query = await api.members.edit(
          ghostUser.id,
          {
            stripe_customer_id: customerId,
          },
          { send_email: false }
        );
        if (query.success) {
          console.log("Successfuly sent stripe customer id to ghost");
        } else {
          console.warn(
            "Failed to send stripe customer id to ghost",
            query.errors
          );
        }
        return json({}, { status: 200 });
      }

      // Occurs whenever a subscription changes (e.g. plan switch).
      case "customer.subscription.updated": {
        const subscription = event.data.object;
        console.log("customer.subscription.updated", subscription);
        // const customerId = String(subscription.customer);

        return json({}, { status: 200 });
      }

      // Occurs whenever a customer’s subscription ends.
      case "customer.subscription.deleted": {
        const subscription = event.data.object;
        console.log("customer.subscription.deleted", subscription);

        return json({}, { status: 200 });
      }
    }
  } catch (err: unknown) {
    console.log(err);
    return json({}, { status: 400 });
  }

  // We'll return a 200 status code for all other events.
  // A `501 Not Implemented` or any other status code could be returned.
  return json({}, { status: 200 });
}
