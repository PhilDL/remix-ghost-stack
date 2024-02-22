import { type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/node";

import { auth } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  await auth.logout(request, { redirectTo: "/" });
}

export async function action({ request }: ActionFunctionArgs) {
  await auth.logout(request, { redirectTo: "/" });
}
