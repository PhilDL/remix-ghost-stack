import { Form, useActionData } from "@remix-run/react";
import { type ActionFunction } from "@remix-run/server-runtime";
import { errorMessagesFor, inputFromFormData } from "domain-functions";
import { AuthenticityTokenInput } from "remix-utils/csrf/react";

import { Button, Input, Label } from "~/ui/components";
import { Textarea } from "~/ui/components/textarea";

import {
  contactFormHandler,
} from "~/domain/contact-form-handler.server";
import {
  addFlashMessage,
  redirectWithFlashMessage,
} from "~/services/flash-message.server";
import { csrf } from "~/services/csrf.server";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.clone().formData();
  // CSRF Protection
  await csrf.validate(formData, request.headers);

  const contactOperation = await contactFormHandler(
    inputFromFormData(formData)
  );
  if (!contactOperation.success) {
    return contactOperation;
  } else {
    const flash = await addFlashMessage(request, {
      type: "success",
      title: "Sent",
      message: "Your message has been sent.",
    });
    return redirectWithFlashMessage("/", flash);
  }
};

export default function Contact() {
  const data = useActionData<typeof action>();

  const nameErrors = errorMessagesFor(data?.inputErrors ?? [], "name");
  const emailErrors = errorMessagesFor(data?.inputErrors ?? [], "email");
  const messageErrors = errorMessagesFor(data?.inputErrors ?? [], "message");

  return (
    <div className="container mx-auto mt-16 max-w-7xl flex-1">
      <h1 className="text-left text-3xl font-semibold text-primary">
        Contact Form
      </h1>
      <p className="text-muted-foreground">
        Here you can contact me. I will try to respond as soon as possible.
      </p>
      <Form className="my-8 grid gap-4 py-4" method="post" id={"contact"}>
        <AuthenticityTokenInput />
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            name="name"
            className="col-span-3"
            placeholder="Your name"
            required={true}
          />
          {nameErrors && (
            <p className="text-sm text-red-600">{nameErrors}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            className="col-span-3"
            required={true}
          />
          {emailErrors && (
            <p className="text-sm text-red-600">{emailErrors}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            name="message"
            className="col-span-3"
            required={true}
          />
          {messageErrors && (
            <p className="text-sm text-red-600">{messageErrors}</p>
          )}
        </div>
        <div className="grid w-full max-w-sm items-center gap-1.5">
          <Button type="submit" variant="default">
            Submit
          </Button>
        </div>
      </Form>
    </div>
  );
}
