// import { sendEmail as mailgunSendEmail } from "./email-mailgun.server";
import { sendEmail as sendgridSendEmail } from "./email-sendgrid.server";

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
  // return mailgunSendEmail({ sender, to, subject, htmlContent });
  return sendgridSendEmail({ sender, to, subject, htmlContent });
};
