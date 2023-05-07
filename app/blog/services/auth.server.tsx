import { render } from "@react-email/render";
import { TSGhostAdminAPI, type Member } from "@ts-ghost/admin-api";
import { Authenticator } from "remix-auth";
import { OTPStrategy } from "remix-auth-otp";
// import { Resend } from "resend";
import invariant from "tiny-invariant";
import { SignInEmail } from "~/emails/sign-in-email";
import { SignUpEmail } from "~/emails/sign-up-email";
import { env } from "~/env";

import { getSiteSettings } from "./ghost.server";
import { sendEmail } from "~/blog/services/email.server";
import { prisma } from "~/shared/db.server";
import { sessionStorage } from "~/shared/session.server";

// This secret is used to encrypt the token sent in the magic link and the
// session used to validate someone else is not trying to sign-in as another
// user.
let secret = env.MAGIC_LINK_SECRET;
if (!secret) throw new Error("Missing MAGIC_LINK_SECRET env variable.");

export type MemberSession = Pick<
  Member,
  "avatar_image" | "id" | "name" | "email" | "subscribed" | "comped" | "status"
> & {
  subscriptions: {
    tier?: string | undefined;
    tier_name?: string | undefined;
    status: string;
    stripe_id: string;
    stripe_customer_id: string;
    stripe_price_id: string;
  }[];
};

export let auth = new Authenticator<MemberSession>(sessionStorage);

// const api = new TSGhostAdminAPI(env.GHOST_URL, env.GHOST_ADMIN_API_KEY, "v5.0");
// const userQuery =

// Here we need the sendEmail, the secret and the URL where the user is sent
// after clicking on the magic link
auth.use(
  new OTPStrategy(
    {
      secret,
      storeCode: async (code) => {
        await prisma.otp.create({
          data: {
            code: code,
            active: true,
            attempts: 0,
          },
        });
      },
      sendCode: async ({ email, code, magicLink, user, form, request }) => {
        const sender = {
          name: "CodingDodo",
          email: "contact@codingdodo.com",
        };
        const settings = await getSiteSettings();
        const to = [{ email }];
        let subject = "";
        let htmlContent = "";

        if (form?.get("context") === "signup") {
          subject = `🙌 Complete your signup to ${settings.title}`;
          htmlContent = render(
            <SignUpEmail
              appName={settings.title}
              magicLink={magicLink}
              loginCode={code}
              accentColor={settings.accent_color || undefined}
              logo={settings.logo || ""}
              name={(form?.get("name") as string) || ""}
              appDescription={settings.description}
            />
          );
        } else {
          subject = `🔑 Secure sign in link for ${settings.title}`;
          htmlContent = render(
            <SignInEmail
              appName={settings.title}
              magicLink={magicLink}
              loginCode={code}
              accentColor={settings.accent_color || undefined}
              logo={settings.logo || ""}
              appDescription={settings.description}
            />
          );
        }
        // Using resend.com example
        // const resend = new Resend(env.RESEND_API_KEY);
        // await resend.sendEmail({
        //   from: "onboarding@resend.dev",
        //   to: "philippe.lattention@hotmail.fr",
        //   subject: "Hello World",
        //   react: (
        //     <SignInEmail
        //       appName={settings.title}
        //       magicLink={magicLink}
        //       loginCode={code}
        //       accentColor={settings.accent_color || undefined}
        //       logo={settings.logo || ""}
        //       appDescription={settings.description}
        //     />
        //   ),
        // });
        await sendEmail({ sender, to, subject, htmlContent });
      },
      validateCode: async (code) => {
        const otp = await prisma.otp.findUnique({
          where: {
            code: code,
          },
        });
        if (!otp) throw new Error("OTP code not found.");

        return {
          code: otp.code,
          active: otp.active,
          attempts: otp.attempts,
        };
      },
      invalidateCode: async (code, active, attempts) => {
        if (!active) {
          await prisma.otp.delete({
            where: {
              code: code,
            },
          });
        } else {
          await prisma.otp.update({
            where: {
              code: code,
            },
            data: {
              active: active,
              attempts: attempts,
            },
          });
        }
      },
    },
    async ({ email, code, magicLink, form, request }) => {
      const api = new TSGhostAdminAPI(
        env.GHOST_URL,
        env.GHOST_ADMIN_API_KEY,
        "v5.0"
      );
      let userQuery = await api.members
        .browse({ filter: `email:${email}` })
        .fields({
          avatar_image: true,
          id: true,
          name: true,
          email: true,
          subscribed: true,
          comped: true,
          status: true,
          subscriptions: true,
        })
        .fetch();
      invariant(userQuery.success, "Failed to fetch user");
      if (userQuery.data.length === 0) {
        throw new Error("User not found");
      }
      const user = userQuery.data[0];
      let result = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar_image: user.avatar_image,
        subscribed: user.subscribed,
        comped: user.comped,
        status: user.status,
        subscriptions: user.subscriptions
          .filter((sub) => sub.status === "active")
          .map((sub) => {
            return {
              tier: sub.tier?.slug,
              tier_name: sub.tier?.name,
              status: sub.status,
              stripe_id: sub.id,
              stripe_customer_id: sub.customer?.id,
              stripe_price_id: sub.price?.id,
            };
          }),
      };

      return result;
    }
  )
);
