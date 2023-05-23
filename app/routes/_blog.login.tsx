import * as React from "react";
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  type Session,
  type V2_MetaFunction,
} from "@remix-run/node";
import {
  Form,
  useLoaderData,
  useNavigation,
  useSearchParams,
} from "@remix-run/react";
import { CheckCircle, Loader, Lock, MailCheck, Stars } from "lucide-react";
import { AuthenticityTokenInput, verifyAuthenticityToken } from "remix-utils";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
  Label,
  LinkButton,
} from "~/ui/components";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/ui/components/card";

import { verifyMember } from "~/domain/verify-member.server";
import { auth } from "~/services/auth.server";
import {
  addFlashMessage,
  commitFlashMessageSession,
} from "~/services/flash-message.server";
import { getSession, sessionStorage } from "~/services/session.server";

export async function loader({ request }: LoaderArgs) {
  await auth.isAuthenticated(request, { successRedirect: "/account" });
  let session = await getSession(request);
  const error = session.get(auth.sessionErrorKey);
  return json(
    {
      magicLinkSent: session.get("auth:otp"),
      magicLinkEmail: session.get("auth:email"),
      error,
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

  const email = session.get("auth:email") || formData.get("email");

  if (formData.get("email")) {
    const verifyMemberExists = await verifyMember({ email: email });
    if (!verifyMemberExists.success) {
      let flash: Session | null = null;
      if (verifyMemberExists.errors.length > 0) {
        flash = await addFlashMessage(request, {
          type: "error",
          title: "Error",
          message: verifyMemberExists.errors[0].message,
          actionText: "Create an account",
          actionUrl: "/join",
        });
      }
      return (
        (flash &&
          json(verifyMemberExists, {
            headers: { "Set-Cookie": await commitFlashMessageSession(flash) },
          })) ||
        json(verifyMemberExists)
      );
    }
  }

  await auth.authenticate("OTP", request, {
    successRedirect: "/login",
    failureRedirect: "/login",
  });
}

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Login",
    },
  ];
};

export default function LoginPage() {
  let { magicLinkSent, magicLinkEmail, error } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const [searchParams] = useSearchParams();
  const emailRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="flex min-h-[55%] flex-col justify-center">
      {magicLinkSent ? (
        <Card className="mx-auto w-full max-w-md px-8">
          <CardHeader>
            <CardTitle className="flex">
              <MailCheck className="mr-2 h-4 w-4" /> Check your Inbox
            </CardTitle>
            <CardDescription>
              We sent a one-time code to{" "}
              {magicLinkEmail ? `to ${magicLinkEmail}` : ""}
              <br />
              Please enter it below.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
                  disabled={navigation.state !== "idle"}
                  aria-disabled={navigation.state !== "idle"}
                />
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Form method="post" id="resendCode" action="/login">
              <AuthenticityTokenInput />
              <Button
                type="submit"
                variant={"link"}
                className="px-1 text-xs"
                form="resendCode"
                size={"sm"}
                aria-disabled={
                  navigation.formAction === "/login" &&
                  navigation.state === "submitting"
                }
              >
                {navigation.formAction === "/login" &&
                navigation.state === "submitting"
                  ? "Sending ..."
                  : "Request a new code ?"}
              </Button>
            </Form>
            <Button form="otpCode" disabled={navigation.state !== "idle"}>
              {navigation.state !== "idle" ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Lock className="mr-2 h-4 w-4" />
              )}{" "}
              Continue
            </Button>
          </CardFooter>
        </Card>
      ) : (
        <Card className="mx-auto w-full max-w-md px-8">
          <CardHeader>
            <CardTitle>Sign-in</CardTitle>
            <CardDescription>
              Enter your email to receive a Sign-In link
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {error && (
              <Alert variant={"destructive"}>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error.message}</AlertDescription>
              </Alert>
            )}
            {magicLinkSent && (
              <Alert>
                <CheckCircle className="h-4 w-4" />
                <AlertTitle>Check your Inbox</AlertTitle>
                <AlertDescription className="text-muted-foreground">
                  We already sent a code to{" "}
                  {magicLinkEmail ? `to ${magicLinkEmail}` : ""}
                  <LinkButton
                    to={"/login"}
                    variant={"link"}
                    className="block px-0"
                  >
                    Click here to enter it
                  </LinkButton>
                </AlertDescription>
              </Alert>
            )}
            <Form method="post" id="signInForm">
              <AuthenticityTokenInput />
              <div>
                <input
                  type="hidden"
                  name="redirectTo"
                  value={searchParams.get("redirectTo") ?? undefined}
                />
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1">
                  <Input
                    ref={emailRef}
                    id="email"
                    required
                    autoFocus={true}
                    name="email"
                    type="email"
                    autoComplete="email"
                    // aria-invalid={actionData?.errors?.email ? true : undefined}
                    aria-describedby="email-error"
                    disabled={navigation.state !== "idle"}
                    aria-disabled={navigation.state !== "idle"}
                  />
                </div>
              </div>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-between">
            <LinkButton
              to="/join"
              variant={"link"}
              className="px-1 text-xs"
              size={"sm"}
              aria-disabled={
                navigation.formAction === "/login" &&
                navigation.state === "submitting"
              }
            >
              Create an account ?
            </LinkButton>
            <Button
              form="signInForm"
              disabled={
                navigation.formAction === "/login" &&
                navigation.state === "submitting"
              }
            >
              {navigation.state !== "idle" ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Stars className="mr-2 h-4 w-4" />
              )}{" "}
              Send Magic link
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
}
