import * as React from "react";
import { cn } from "~/ui/utils";

export type GhostImageRatioProps = {
  size: 100 | 200 | 300 | 400 | 500 | 600;
};

export const GhostImage = React.forwardRef<
  HTMLImageElement,
  React.ImgHTMLAttributes<HTMLImageElement> & GhostImageRatioProps
>(({ className, alt, src, size, ...props }, ref) => {
  const url = src?.includes("content/images")
    ? src.replace("content/images", `content/images/size/w${size}`)
    : src;
  return (
    <img
      ref={ref}
      className={cn("rounded object-cover", className)}
      alt={alt}
      src={url}
      {...props}
    />
  );
});

GhostImage.displayName = "GhostImage";
