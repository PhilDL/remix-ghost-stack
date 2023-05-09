import sendgrid, { type ResponseError } from "@sendgrid/mail";
import invariant from "tiny-invariant";
import { env } from "~/env";

const isSendgridReponseError = (error: unknown): error is ResponseError => {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    "response" in error
  );
};

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
  if (!env.SENDGRID_API_KEY) {
    console.warn("No SENDGRID_API_KEY set, not sending email.");
    console.log(
      "Mock Email from",
      sender,
      "Mock Email to",
      to,
      "with subject",
      subject,
      "and body",
      htmlContent
    );
    return;
  }
  sendgrid.setApiKey(env.SENDGRID_API_KEY);
  const options = {
    from: sender,
    to,
    subject,
    html: htmlContent,
  };

  try {
    await sendgrid.send(options);
  } catch (error: unknown) {
    if (isSendgridReponseError(error)) {
      console.error(error.response.body);
      throw Error("There was an error on the server-side sending the email.");
    }
  }
};
