import {
  json,
  redirect,
  type ActionFunction,
  type LoaderArgs,
} from "@remix-run/node";
import {
  Form,
  useFetcher,
  useLoaderData,
  useNavigation,
} from "@remix-run/react";
import type { Tier } from "@ts-ghost/content-api";
import { CheckCircle, GemIcon } from "lucide-react";
import { AuthenticityTokenInput, verifyAuthenticityToken } from "remix-utils";
import type Stripe from "stripe";
import invariant from "tiny-invariant";

import { Badge, Button, LinkButton } from "~/ui/components";
import { Avatar, AvatarFallback, AvatarImage } from "~/ui/components/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/ui/components/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/ui/components/tabs";

import { auth } from "~/services/auth.server";
import {
  cachedGetGhostTiers,
  getMember,
  getMemberActiveSubscriptions,
} from "~/services/ghost.server";
import { getSession } from "~/services/session.server";
import { createCheckoutSession } from "~/services/stripe/checkout.server";
import { getProductAndPriceByName } from "~/services/stripe/products.server";

export let loader = async ({ request }: LoaderArgs) => {
  // If the user is here, it's already authenticated, if not redirect them to
  // the login page.
  const userSession = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const user = await getMember(userSession.id);
  const tiers: (Tier & {
    stripe?: {
      product: Stripe.Product;
      prices: Stripe.Price[];
    };
  })[] = await cachedGetGhostTiers();

  for (const tier of tiers) {
    tier.stripe = await getProductAndPriceByName(tier.name);
  }
  return json({ user, tiers });
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.clone().formData();
  // CSRF Protection
  await verifyAuthenticityToken(formData, await getSession(request));

  const user = await auth.isAuthenticated(request, {
    failureRedirect: "/login",
  });
  const subscriptions = await getMemberActiveSubscriptions(user.id);
  const priceId = formData.get("priceId") as string;
  invariant(priceId, "priceId is required");
  let stripeCustomerId = undefined;
  if (subscriptions && subscriptions.length > 0) {
    stripeCustomerId = subscriptions[0].customer?.id ?? undefined;
  }

  const checkoutSession = await createCheckoutSession({
    customerId: stripeCustomerId,
    customerEmail: user.email,
    priceId: formData.get("priceId") as string,
    mode: "subscription",
    cancelUrl: "/account",
    successUrl: "/checkout",
  });
  invariant(
    checkoutSession.url,
    "there was a problem creating the checkout session"
  );
  return redirect(checkoutSession.url);
};

const formatCurrency = (amount: number | null, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format((amount || 0) / 100);
};

export const TierCard = ({
  tier,
  interval = "month",
}: {
  tier: Tier & {
    stripe?: {
      product: Stripe.Product;
      prices: Stripe.Price[];
    };
  };
  interval: "day" | "month" | "week" | "year";
}) => {
  const navigation = useNavigation();
  return (
    <Card key={tier.id}>
      <CardHeader>
        <CardTitle>{tier.name}</CardTitle>
        <CardDescription>{tier.description}</CardDescription>
        <div className="grid grid-cols-2">
          <ul className="ml-4 mt-3 text-sm">
            {tier.benefits.map((benefit, index) => (
              <li key={index} className="flex flex-row items-center">
                <CheckCircle className="mr-2 h-3 w-3 " />
                {benefit}
              </li>
            ))}
          </ul>
          <div className="flex w-full flex-col p-0">
            {tier.stripe &&
              tier.stripe.product &&
              tier.stripe.prices
                .filter(
                  (p) =>
                    p.type === "recurring" && p.recurring?.interval === interval
                )
                .map((price) => (
                  <Form
                    method="post"
                    key={price.id}
                    className="flex h-full w-full flex-col items-end justify-between gap-3"
                  >
                    <AuthenticityTokenInput />
                    <input type="hidden" name="priceId" value={price.id} />
                    <div className="relative mb-4">
                      <span className="text-2xl font-bold">
                        {formatCurrency(price.unit_amount, price.currency)}
                      </span>
                      <span className="absolute -bottom-3 right-0 text-xs text-muted-foreground">
                        /{interval}
                      </span>
                    </div>
                    <Button
                      size={"sm"}
                      type="submit"
                      disabled={navigation.formMethod === "POST"}
                    >
                      {navigation.formMethod === "POST"
                        ? "Redirecting..."
                        : "Upgrade"}
                    </Button>
                  </Form>
                ))}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default function Account() {
  const { user, tiers } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();

  return (
    <div className="my-auto flex min-h-[70%] flex-col items-center justify-center gap-8">
      <Card className="w-[400px]">
        <CardHeader>
          <CardTitle>Welcome {user.name}</CardTitle>
          <CardDescription>Logged in as {user.email}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col justify-start gap-1">
          <div className="flex justify-start gap-3">
            <Avatar>
              <AvatarImage src={user.avatar_image} />
              <AvatarFallback>PL</AvatarFallback>
            </Avatar>
            {user.subscribed && (
              <div className="flex w-full flex-row items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  You are subscribed
                </span>
                {user.status === "free" ? (
                  <span>"Free tier"</span>
                ) : (
                  <>
                    {user.subscriptions.length > 1 &&
                      user.subscriptions
                        .filter((sub) => sub.status === "active")
                        .map((sub) => (
                          <Badge key={sub.id}>
                            <GemIcon className="mr-1 h-3 w-3" />
                            {sub.tier?.name}
                          </Badge>
                        ))}
                  </>
                )}
              </div>
            )}
          </div>
          {user.status === "paid" && (
            <fetcher.Form
              method="post"
              action="/api/stripe/create-customer-portal"
            >
              <Button variant={"link"} size="sm" className="pl-0">
                {fetcher.state !== "idle"
                  ? "Redirecting ..."
                  : "Update subscription"}
              </Button>
            </fetcher.Form>
          )}
        </CardContent>
        <CardFooter className="flex justify-between">
          <form action="/logout">
            <Button variant="outline">Logout</Button>
          </form>
        </CardFooter>
      </Card>

      <Tabs defaultValue="yearly" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="monthly">Monthly</TabsTrigger>
          <TabsTrigger value="yearly">Yearly</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} interval="month" />
          ))}
        </TabsContent>
        <TabsContent value="yearly">
          {tiers.map((tier) => (
            <TierCard key={tier.id} tier={tier} interval="year" />
          ))}
        </TabsContent>
      </Tabs>
    </div>
  );
}
