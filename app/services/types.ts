import type { LoaderFunction, SerializeFrom } from "@remix-run/server-runtime";

export type UwrapJSONLoaderData<T extends LoaderFunction> = SerializeFrom<T>;

export type UwrapLoaderData<T extends LoaderFunction> = Awaited<ReturnType<T>>;
