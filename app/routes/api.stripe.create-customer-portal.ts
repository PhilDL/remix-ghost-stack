import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";
import { createStripeCustomerPortalSession } from "~/services/stripe/create-customer-portal";

import { auth } from "~/services/auth.server";
import { getMemberActiveSubscriptions } from "~/services/ghost.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });
  return redirect("/account");
}

export async function action({ request }: ActionFunctionArgs) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/",
  });
  const subscriptions = await getMemberActiveSubscriptions(user.id);

  let stripeCustomerId = undefined;
  if (subscriptions && subscriptions.length > 0) {
    stripeCustomerId = subscriptions[0].customer?.id ?? undefined;
  }
  if (!stripeCustomerId) return redirect("/login");

  // Redirect to Customer Portal.
  if (stripeCustomerId) {
    const customerPortalUrl = await createStripeCustomerPortalSession(
      stripeCustomerId
    );
    return redirect(customerPortalUrl);
  }

  return json({}, { status: 400 });
}
