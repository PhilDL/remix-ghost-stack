import { makeDomainFunction } from "domain-functions";
import * as z from "zod";

export const inputContactForm = z.object({
  name: z.string().nonempty(),
  email: z.string().email(),
  message: z.string().nonempty(),
});

export const contactFormHandler = makeDomainFunction(inputContactForm)(
  async ({ name, email, message }) => {
    console.log("name", name);
    console.log("email", email);
    console.log("message", message);

    // Do something here
  }
);
