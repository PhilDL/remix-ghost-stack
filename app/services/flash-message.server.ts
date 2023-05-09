import {
  createCookieSessionStorage,
  json,
  redirect,
  type Session,
} from "@remix-run/node";
import type { ErrorResult } from "domain-functions";
import { env } from "~/env";

export type ToastMessage = {
  title: string;
  message: string;
  type: "success" | "error";
  actionText?: string;
  actionUrl?: string;
};

const ONE_YEAR = 1000 * 60 * 60 * 24 * 365;

export const {
  commitSession: commitFlashMessageSession,
  getSession: getFlashMessageSession,
} = createCookieSessionStorage({
  cookie: {
    name: "__message",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    // expires: new Date(Date.now() + ONE_YEAR),
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function addFlashMessage(request: Request, message: ToastMessage) {
  const session = await getFlashMessageSession(request.headers.get("Cookie"));
  session.flash("toastMessage", message);
  return session;
}

export async function redirectWithFlashMessage(url: string, session: Session) {
  return redirect(url, {
    headers: { "Set-Cookie": await commitFlashMessageSession(session) },
  });
}

export function setSuccessMessage(
  session: Session,
  message: string,
  title: string
) {
  session.flash("toastMessage", {
    message,
    type: "success",
    title,
  } as ToastMessage);
}

export function setErrorMessage(
  session: Session,
  message: string,
  title: string
) {
  session.flash("toastMessage", {
    message,
    type: "error",
    title,
  } as ToastMessage);
}

export async function wrapDomainErrorJSON(
  errorResult: ErrorResult,
  request: Request
) {
  let flash: Session | null = null;
  if (errorResult.errors.length > 0) {
    flash = await addFlashMessage(request, {
      type: "error",
      title: "Error",
      message: errorResult.errors[0].message,
    });
  }
  return (
    (flash &&
      json(errorResult, {
        headers: { "Set-Cookie": await commitFlashMessageSession(flash) },
      })) ||
    json(errorResult)
  );
}
