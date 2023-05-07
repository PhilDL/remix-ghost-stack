import React from "react";
import { cn } from "~/ui/utils";

export type HeroProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  showForm?: boolean;
  backdropBlur?: boolean;
};
const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    { className, title, showForm, backdropBlur, description, ...props },
    ref
  ) => {
    // let bgClassName = "bg-gradient-to-br from-cornflower-500 to-pink-500";
    return (
      <div
        className={cn(
          "align-center flex flex-col items-center justify-center rounded  px-4 py-12 bg-gradient-to-br via-cornflower-500 from-saffron-500 to-pink-500",
          className
        )}
        ref={ref}
        {...props}
      >
        <div
          className={cn(
            "flex max-w-[40rem] flex-col gap-4 rounded bg-black/20 px-4 py-6 text-white",
            backdropBlur && "backdrop-blur-md"
          )}
        >
          <h1 className="text-center text-2xl font-extrabold">{title}</h1>
          <p className="max-w-[25rem] text-center">{description}</p>
          {showForm && (
            <form className="flex flex-col justify-center gap-3 rounded bg-white p-2 sm:flex-row sm:justify-between">
              <input
                type="text"
                className="rounded border-none px-3 py-2 text-gray-500 outline-none"
                placeholder="Your email address"
              />
              <button
                className="rounded bg-gradient-to-r from-cornflower-500 to-pink-500 
            px-6 py-3 text-sm 
             font-semibold uppercase
            text-white hover:from-pink-500 hover:to-cornflower-500 hover:transition-all hover:duration-300 sm:px-12"
                type="submit"
              >
                Join Now
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }
);
Hero.displayName = "Hero";

export { Hero };
