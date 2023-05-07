import * as React from "react";
import {
  json,
  type ActionArgs,
  type LoaderArgs,
  type Session,
  type V2_MetaFunction,
} from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { inputFromFormData } from "domain-functions";
import { CheckCircle, Loader, MailIcon } from "lucide-react";
import { AuthenticityTokenInput, verifyAuthenticityToken } from "remix-utils";
import type { loader as rootBlogLoader } from "~/routes/_blog";
import type { UwrapJSONLoaderData } from "~/shared/types";
import { useMatchesData } from "~/shared/utils";

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

import { createMember } from "~/blog/domain/create-member.server";
import { auth } from "~/blog/services/auth.server";
import {
  addFlashMessage,
  commitFlashMessageSession,
  redirectWithFlashMessage,
} from "~/shared/flash-message.server";
import { getSession, sessionStorage } from "~/shared/session.server";

export async function loader({ request }: LoaderArgs) {
  await auth.isAuthenticated(request, { successRedirect: "/account" });
  let session = await sessionStorage.getSession(request.headers.get("Cookie"));
  return json({
    magicLinkSent: session.has("auth:otp"),
    magicLinkEmail: session.get("auth:email"),
  });
}

export async function action({ request }: ActionArgs) {
  const formData = await request.clone().formData();
  // CSRF Protection
  await verifyAuthenticityToken(formData, await getSession(request));

  const createOperation = await createMember(inputFromFormData(formData));
  if (createOperation.success) {
    await auth.authenticate("OTP", request, {
      successRedirect: "/welcome",
      failureRedirect: "/join",
    });
  } else {
    let flash: Session | null = null;
    if (createOperation.errors.length > 0) {
      flash = await addFlashMessage(request, {
        type: "error",
        title: "Error",
        message: createOperation.errors[0].message,
        actionText: "Sign-In",
        actionUrl: "/login",
      });
    }
    return (
      (flash &&
        json(createOperation, {
          headers: { "Set-Cookie": await commitFlashMessageSession(flash) },
        })) ||
      json(createOperation)
    );
  }
  const flash = await addFlashMessage(request, {
    type: "success",
    title: "Account created",
    message: "Please check your email to confirm your account.",
  });
  return redirectWithFlashMessage(`/join`, flash);
}

export const meta: V2_MetaFunction = () => {
  return [
    {
      title: "Join",
    },
  ];
};

export default function LoginPage() {
  let { magicLinkSent, magicLinkEmail } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const { settings } = useMatchesData("routes/_blog") as UwrapJSONLoaderData<
    typeof rootBlogLoader
  >;

  return (
    <div className="flex min-h-[55%] flex-col justify-center">
      <Card className="mx-auto w-full max-w-md px-8">
        <CardHeader>
          <CardTitle>Sign-up</CardTitle>
          <CardDescription>
            Sign up to {settings.title} to get access to member's content.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {magicLinkSent && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertTitle>Check your Inbox</AlertTitle>
              <AlertDescription>
                Successfully sent magic link{" "}
                {magicLinkEmail ? `to ${magicLinkEmail}` : ""}
              </AlertDescription>
            </Alert>
          )}
          <Form method="post" id="signUpForm" className="flex flex-col gap-4">
            <div>
              <AuthenticityTokenInput />
              <input type="hidden" name="context" value="signup" />
              <Label htmlFor="name">Name</Label>
              <div className="mt-1">
                <Input
                  id="name"
                  required
                  autoFocus={true}
                  name="name"
                  type="name"
                  autoComplete="name"
                  // aria-invalid={actionData?.errors?.name ? true : undefined}
                  aria-describedby="name-error"
                  disabled={
                    navigation.formAction === "/join" &&
                    navigation.state === "submitting"
                  }
                  aria-disabled={
                    navigation.formAction === "/join" &&
                    navigation.state === "submitting"
                  }
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email address</Label>
              <div className="mt-1">
                <Input
                  id="email"
                  required
                  name="email"
                  type="email"
                  autoComplete="email"
                  // aria-invalid={actionData?.errors?.email ? true : undefined}
                  aria-describedby="email-error"
                  disabled={
                    navigation.formAction === "/join" &&
                    navigation.state === "submitting"
                  }
                  aria-disabled={
                    navigation.formAction === "/join" &&
                    navigation.state === "submitting"
                  }
                />
              </div>
            </div>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-between">
          <LinkButton
            to="/login"
            variant={"link"}
            className="px-1 text-xs"
            size={"sm"}
            aria-disabled={
              navigation.formAction === "/join" &&
              navigation.state === "submitting"
            }
          >
            Already have an account ?
          </LinkButton>
          {!magicLinkSent && (
            <Button
              form="signUpForm"
              disabled={
                navigation.formAction === "/join" &&
                navigation.state === "submitting"
              }
            >
              {navigation.formAction === "/join" &&
              navigation.state === "submitting" ? (
                <Loader className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <MailIcon className="mr-2 h-4 w-4" />
              )}{" "}
              Subscribe
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// http://localhost:3000/magic?token=U2FsdGVkX1%2B8hzKiMD4xuVdjjchulBhrTe%2BhihJ2jeAY%2BaOJf6gbUEV%2BWzpwOhLTb9Pfcx6NCEDbfsVO1kf7onhu6cxTfhL4QMazZo4CaQw%3D
