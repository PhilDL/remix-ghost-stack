import { isTheme, Theme } from "./theme-provider";
import { createCookieSessionStorage } from "@remix-run/node";
import { env } from "~/env";

const themeStorage = createCookieSessionStorage({
  cookie: {
    name: "__theme",
    sameSite: "lax",
    path: "/",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
  },
});

async function getThemeSession(request: Request) {
  const session = await themeStorage.getSession(request.headers.get("Cookie"));
  return {
    getTheme: () => {
      const themeValue = session.get("theme");
      return isTheme(themeValue) ? themeValue : Theme.DARK;
    },
    setTheme: (theme: Theme) => session.set("theme", theme),
    commit: () => themeStorage.commitSession(session),
  };
}

export { getThemeSession };
