import fontStylesheet from "./styles/fonts.css?url";
import nordthemeStylesheet from "./styles/nordtheme.css?url";
import tailwindStylesheetUrl from "./tailwind.css?url";
import {
  json,
  type LinksFunction,
  type LoaderFunctionArgs,
  type MetaFunction,
} from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
  type ShouldRevalidateFunction,
} from "@remix-run/react";
import {
  NonFlashOfWrongThemeEls,
  ThemeProvider,
  useTheme,
} from "~/ui/utils/theme-provider";
import clsx from "clsx";
import { ClientOnly } from "remix-utils/client-only";

import { Toaster } from "~/ui/components/toaster";

import { getThemeSession } from "./ui/utils/theme.server";

export const links: LinksFunction = () => {
  return [
    { rel: "stylesheet", href: fontStylesheet },
    { rel: "stylesheet", href: tailwindStylesheetUrl },
    { rel: "stylesheet", href: nordthemeStylesheet },
    {
      rel: "icon",
      href: "https://digitalpress.fra1.cdn.digitaloceanspaces.com/0bwz1yk/2023/05/logo-ts-ghost.png",
      type: "image/png",
    },
  ];
};

export const meta: MetaFunction = () => [
  { title: "Remix Ghost Stack - Remix App with Ghost CMS in Headless Mode" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  const themeSession = await getThemeSession(request);
  return json({
    theme: themeSession.getTheme(),
  });
}

function App() {
  const data = useLoaderData<typeof loader>();
  const [theme] = useTheme();
  return (
    <html lang="en" className={clsx("h-full", theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <NonFlashOfWrongThemeEls ssrTheme={Boolean(data.theme)} />
      </head>
      <body className="h-full bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <ClientOnly>{() => <Toaster />}</ClientOnly>
      </body>
    </html>
  );
}

export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>();

  return (
    <ThemeProvider specifiedTheme={data.theme}>
      <App />
    </ThemeProvider>
  );
}

export const shouldRevalidate: ShouldRevalidateFunction = ({
  formAction,
  formMethod,
  defaultShouldRevalidate,
}) => {
  if (formMethod === "POST" && formAction?.startsWith("/action/")) {
    return false;
  }
  return defaultShouldRevalidate;
};
