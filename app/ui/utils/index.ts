import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function nameInitials(name: string) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("");
}

export function ghostImage(
  url: string,
  size: 100 | 200 | 300 | 400 | 500 | 600 | 1200
) {
  if (!url.includes("content/images")) {
    return url;
  }
  return url.replace("content/images", `content/images/size/w${size}`);
}
