import { Separator } from "../separator";
import { Form, Link, useNavigation } from "@remix-run/react";
import type { Settings } from "@ts-ghost/content-api";
import { CheckCircle } from "lucide-react";
import { AuthenticityTokenInput } from "remix-utils";

import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Input,
  Label,
} from "~/ui/components";
import { SocialLinks } from "~/ui/components/social-links";

import type { MemberSession } from "~/services/auth.server";

export type FooterProps = {
  settings: Settings;
  user: MemberSession | undefined | null;
  magicLinkSent?: boolean;
  magicLinkEmail?: string;
};

export const Footer = ({
  settings,
  user,
  magicLinkSent = false,
  magicLinkEmail,
}: FooterProps) => {
  const navigation = useNavigation();

  return (
    <footer className="flex flex-col gap-3">
      <Separator />
      <div className="rounded p-3 lg:p-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:justify-between">
          <div className="lg:flex lg:flex-1 lg:flex-col lg:gap-4">
            <img src={settings.logo ?? ""} alt="" className="w-40" />
            <p className="max-w-[30ch] text-slate-400">
              {settings.description}
            </p>
            <SocialLinks
              className="flex justify-start gap-2"
              facebook={settings.facebook || undefined}
              twitter={settings.twitter || undefined}
              linkedin="#"
              github={"https://github.com/PhilDL"}
              rss="#"
            />
          </div>
          <div className="text-left lg:flex lg:flex-1 lg:flex-col lg:gap-4">
            <h3 className="font-bold text-white">Navigation</h3>
            <div className="flex">
              <ul className="flex-1 text-slate-400">
                {settings.navigation.map((item) => (
                  <li key={item.url}>
                    <Link to={item.url} className="hover:text-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
              <ul className="flex-1 text-slate-400">
                {settings.secondary_navigation.map((item) => (
                  <li key={item.url}>
                    <Link to={item.url} className="hover:text-link">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="lg:flex-1">
            {!user && (
              <div className="flex">
                <div className="flex flex-1 flex-col gap-3">
                  <h3 className="font-bold text-white">Subscribe</h3>
                  {magicLinkSent ? (
                    <Alert>
                      <CheckCircle className="h-4 w-4" />
                      <AlertTitle>Thank you for subscribing</AlertTitle>
                      <AlertDescription>
                        Please check your inbox to confirm your email.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <Form
                      action="/join"
                      className="flex flex-col gap-3"
                      method="POST"
                    >
                      <AuthenticityTokenInput />
                      <Label htmlFor="name" className="sr-only">
                        Your name
                      </Label>
                      <Input
                        type="text"
                        className="rounded"
                        placeholder="Your name"
                        id="name"
                        name="name"
                        disabled={
                          navigation.formAction === "/join" &&
                          navigation.state === "submitting"
                        }
                      />
                      <Label htmlFor="email" className="sr-only">
                        Your email
                      </Label>
                      <Input
                        type="email"
                        className="rounded"
                        placeholder="Your email address"
                        id="email"
                        name="email"
                        disabled={
                          navigation.formAction === "/join" &&
                          navigation.state === "submitting"
                        }
                      />
                      <Button
                        type="submit"
                        disabled={
                          navigation.formAction === "/join" &&
                          navigation.state === "submitting"
                        }
                        className="rounded bg-gradient-to-r from-blue-900 to-teal-300 py-3 text-sm font-semibold uppercase text-white"
                      >
                        SUBSCRIBE
                      </Button>
                    </Form>
                  )}
                </div>
                <div className="flex-1 lg:grow-0"></div>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="py-4 text-center text-slate-600 dark:text-slate-300">
        ©{settings.title} {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};
