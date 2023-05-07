import * as React from "react";
import { buttonVariants } from "./button";
import { Link, type LinkProps } from "@remix-run/react";
import type { VariantProps } from "class-variance-authority";
import { cn } from "~/ui/utils";

export interface LinkButtonProps
  extends LinkProps,
    VariantProps<typeof buttonVariants> {}

const LinkButton = React.forwardRef<HTMLAnchorElement, LinkButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <Link
        className={cn(
          "no-underline",
          buttonVariants({ variant, size, className })
        )}
        ref={ref}
        {...props}
      >
        {props.children}
      </Link>
    );
  }
);
LinkButton.displayName = "LinkButton";

export { LinkButton };
