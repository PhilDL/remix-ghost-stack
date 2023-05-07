import { useState } from "react";
import { json, type LoaderArgs } from "@remix-run/node";
import { useLoaderData, useSubmit } from "@remix-run/react";
import { Loader } from "lucide-react";

import { LinkButton } from "~/ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/ui/components/card";
import { useInterval } from "~/ui/hooks/use-interval";

import { auth } from "~/blog/services/auth.server";
import { getMemberActiveSubscriptions } from "~/blog/services/ghost.server";

export async function loader({ request }: LoaderArgs) {
  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const subscriptions = await getMemberActiveSubscriptions(user.id);

  // User is already subscribed.
  //   if (subscriptions.filter((sub) => sub.id.startsWith("sub_")).length > 0)
  //     return redirect("/account");

  return json({
    pending:
      subscriptions.filter((sub) => sub.id.startsWith("sub_")).length === 0,
    subscription:
      subscriptions.filter((sub) => sub.id.startsWith("sub_"))[0] || undefined,
  });
}

export default function Checkout() {
  const { pending, subscription } = useLoaderData<typeof loader>();
  const [retries, setRetries] = useState(0);
  const submit = useSubmit();

  //Re-fetch subscription every 'x' seconds.
  useInterval(
    () => {
      submit(null);
      setRetries(retries + 1);
    },
    pending && retries !== 3 ? 2_000 : null
  );

  return (
    <div className="m-auto flex min-h-[70%] max-w-md flex-col items-center justify-center px-6">
      {/* Pending Message. */}
      {pending && retries < 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Thank you for subscribing!</CardTitle>
            <CardDescription>Completing your checkout...</CardDescription>
          </CardHeader>
          <CardContent className="text-muted-foreground">
            <Loader className="inline-flex animate-spin" /> This will take a few
            seconds.
          </CardContent>
          <CardFooter></CardFooter>
        </Card>
      )}

      {/* Success Message. */}
      {!pending && (
        <Card>
          <CardHeader>
            <CardTitle>Checkout completed!</CardTitle>
            <CardDescription>Enjoy your new subscription plan!</CardDescription>
          </CardHeader>
          <CardContent>
            You are now subscribed to the{" "}
            <strong>{subscription && subscription.tier?.name}</strong> plan.
          </CardContent>
          <CardFooter>
            <LinkButton to="/account" prefetch="intent" className="w-full">
              Continue to Account
            </LinkButton>
          </CardFooter>
        </Card>
      )}

      {/* Error Message. */}
      {pending && retries === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              An error occured during the subscription
            </CardDescription>
          </CardHeader>
          <CardContent>
            Something went wrong. Please contact us directly and we will solve
            it for you.
          </CardContent>
          <CardFooter>
            <LinkButton to="/account" prefetch="intent" className="w-full">
              Continue to Account
            </LinkButton>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
