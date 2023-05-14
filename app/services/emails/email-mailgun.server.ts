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
  if (!env.MAILGUN_API_KEY || !env.MAILGUN_DOMAIN) {
    console.warn(
      "No MAILGUN_API_KEY or MAILGUN_DOMAIN set, not sending email."
    );
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
  const auth = `${Buffer.from(`api:${env.MAILGUN_API_KEY}`).toString(
    "base64"
  )}`;
  const body = new URLSearchParams({
    from: `${sender.name} <${sender.email}>`,
    to: to.map((t) => t.email).join(","),
    subject,
    html: htmlContent,
  });
  try {
    await fetch(`https://api.mailgun.net/v3/${env.MAILGUN_DOMAIN}/messages`, {
      method: "POST",
      body,
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
  } catch (error: unknown) {
    console.error(error);
  }
};
