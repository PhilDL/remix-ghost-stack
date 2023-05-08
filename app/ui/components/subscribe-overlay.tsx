import React from "react";
import { cn } from "~/ui/utils";

const PostSubscribeCTA = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <div className="absolute bottom-0 flex h-[15%] w-full flex-col items-center justify-end gap-4 rounded-b-md bg-gradient-to-b from-white/10 to-white to-85% pb-8 dark:from-slate-950/10 dark:to-slate-950">
    <div
      className={cn(
        "flex w-full flex-col items-center justify-between rounded-lg border bg-white/80 dark:bg-slate-950/90 p-6 text-center text-card-foreground border-none",
        className
      )}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  </div>
));

PostSubscribeCTA.displayName = "PostSubscribeCTA";

export { PostSubscribeCTA };
