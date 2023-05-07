import * as React from "react";
import { buttonVariants } from "./button";
import { cva, type VariantProps } from "class-variance-authority";
import { Loader, Save } from "lucide-react";
import { cn } from "~/ui/utils";

const buttonIconVariants = cva("mr-1", {
  variants: {
    size: {
      default: "h-5 w-5",
      sm: "h-4 w-4",
      lg: "h-6 w-6",
    },
  },
  defaultVariants: {
    size: "default",
  },
});

export interface SaveButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  navigationState: "submitting" | "idle" | "loading";
}

const SaveButton = React.forwardRef<HTMLButtonElement, SaveButtonProps>(
  (
    { className, variant, size, children, navigationState, disabled, ...props },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, size, className }),
          "flex flex-row items-center justify-center"
        )}
        ref={ref}
        disabled={disabled || navigationState === "submitting"}
        {...props}
      >
        {navigationState === "submitting" ? (
          <Loader
            className={cn(buttonIconVariants({ size }), "animate-spin")}
          />
        ) : (
          <Save className={cn(buttonIconVariants({ size }))} />
        )}{" "}
        {children}
      </button>
    );
  }
);
SaveButton.displayName = "SaveButton";

export { SaveButton };
