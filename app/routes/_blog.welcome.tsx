import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import {
  json,
  type ActionArgs,
  type LoaderArgs,
} from "@remix-run/server-runtime";
import { Loader, Lock } from "lucide-react";
import { AuthenticityTokenInput, verifyAuthenticityToken } from "remix-utils";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Input,
  Label,
} from "~/ui/components";

import { auth } from "~/blog/services/auth.server";
import { getSession, sessionStorage } from "~/shared/session.server";

export async function loader({ request }: LoaderArgs) {
  await auth.isAuthenticated(request, { successRedirect: "/account" });
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  const error = session.get(auth.sessionErrorKey);
  const magicLinkSent = session.get("auth:otp");
  const magicLinkEmail = session.get("auth:email");
  return json(
    {
      error,
      magicLinkSent,
      magicLinkEmail,
    },
    {
      headers: {
        "Set-Cookie": await sessionStorage.commitSession(session),
      },
    }
  );
}

export async function action({ request }: ActionArgs) {
  const formData = await request.clone().formData();
  const session = await getSession(request);
  // CSRF Protection
  await verifyAuthenticityToken(formData, session);

  await auth.authenticate("OTP", request, {
    successRedirect: "/account",
    failureRedirect: "/welcome",
  });
}

export default function Welcome() {
  const { magicLinkEmail, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  return (
    <div className="flex min-h-[55%] flex-col justify-center">
      <Card className="mx-auto w-full max-w-md px-8">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>Thank you for signing up.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          We sent you a verification email, please check your inbox at{" "}
          <span className="text-muted-foreground">{magicLinkEmail}</span> and
          enter the provided code below.
          {error && (
            <Alert variant={"destructive"}>
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error.message}</AlertDescription>
            </Alert>
          )}
          <Form method="post" id="otpCode">
            <AuthenticityTokenInput />
            <Label htmlFor="code">Code</Label>
            <div className="mt-1">
              <Input
                type="text"
                name="code"
                placeholder="Insert code .."
                required
                autoFocus={true}
                disabled={navigation.formAction === "/welcome"}
              />
            </div>
          </Form>
          <p className="text-xs text-muted-foreground">
            Alternatively, if you are on the same device, you can click on the
            link in the email to automatically verify your account and log-in.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Form method="post" id="resendCode" action="/welcome">
            <AuthenticityTokenInput />
            <Button
              type="submit"
              variant={"link"}
              className="px-1 text-xs"
              form="resendCode"
              size={"sm"}
              aria-disabled={navigation.formAction === "/welcome"}
              disabled={navigation.formAction === "/welcome"}
            >
              {navigation.formAction === "/welcome"
                ? "Sending ..."
                : "Request a new code ?"}
            </Button>
          </Form>
          <Button
            form="otpCode"
            disabled={navigation.formAction === "/welcome"}
            aria-disabled={navigation.formAction === "/welcome"}
          >
            {navigation.formAction === "/welcome" ? (
              <Loader className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Lock className="mr-2 h-4 w-4" />
            )}{" "}
            Continue
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
