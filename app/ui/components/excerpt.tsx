import React from "react";
import { cn } from "~/ui/utils";

export type ExcerptProps = React.HTMLAttributes<HTMLParagraphElement> & {
  excerpt: string;
  custom_excerpt?: string | null;
};
const Excerpt = React.forwardRef<HTMLParagraphElement, ExcerptProps>(
  ({ excerpt, custom_excerpt, className, ...props }, ref) => {
    const exerpt = `${custom_excerpt ?? excerpt.slice(0, 100)}...`;
    return (
      <p
        className={cn("text-md text-muted-foreground", className)}
        {...props}
        ref={ref}
      >
        {exerpt}
      </p>
    );
  }
);

Excerpt.displayName = "Excerpt";

export { Excerpt };
