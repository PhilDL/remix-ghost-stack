import sendgrid from "@sendgrid/mail";
import invariant from "tiny-invariant";
import { env } from "~/env";

export let sendEmail = async ({
  sender,
  to,
  subject,
  htmlContent,
}: {
  sender: { name: string; email: string };
  to: { email: string }[];
  subject: string;
  htmlContent: string;
}) => {
  invariant(env.SENDGRID_API_KEY, "SENDGRID_API_KEY is not set.");
  sendgrid.setApiKey(env.SENDGRID_API_KEY);
  console.log(
    "Sending email from",
    sender,
    "Sending email to",
    to,
    "with subject",
    subject,
    "and body",
    htmlContent
  );

  const options = {
    from: sender,
    to,
    subject,
    html: htmlContent,
  };

  await sendgrid.send(options);
};
