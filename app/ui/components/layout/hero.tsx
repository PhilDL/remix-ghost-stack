import React from "react";
import { cn } from "~/ui/utils";

import { LinkButton } from "~/ui/components";

export type HeroProps = React.HTMLAttributes<HTMLDivElement> & {
  title: string;
  description: string;
  showForm?: boolean;
  backdropBlur?: boolean;
  image?: string;
};
const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    { className, title, showForm, backdropBlur, description, image, ...props },
    ref
  ) => {
    return (
      <div
        className={cn(
          "align-center flex flex-col items-center justify-center rounded  px-4 py-12 bg-gradient-to-br via-blue-800 from-saffron-500 to-pink-500 bg-no-repeat",
          className
        )}
        ref={ref}
        {...props}
        style={
          (image && {
            backgroundImage: `url(${image})`,
          }) ||
          {}
        }
      >
        <div
          className={cn(
            "flex max-w-[40rem] flex-col gap-4 rounded bg-black/20 px-4 py-6 text-white",
            backdropBlur && "backdrop-blur-md"
          )}
        >
          <h1 className="text-center text-2xl font-extrabold">{title}</h1>
          <p className="text-center">{description}</p>
          {showForm && (
            <div className="flex flex-col items-center justify-center gap-3 rounded p-2">
              <LinkButton
                className="background-animate w-52 rounded bg-gradient-to-r 
            from-blue-900 to-teal-300 px-6 
             py-3 text-sm font-semibold uppercase 
            text-white hover:border hover:border-white sm:px-12"
                to={"/join"}
              >
                Subscribe
              </LinkButton>
            </div>
          )}
        </div>
      </div>
    );
  }
);
Hero.displayName = "Hero";

export { Hero };
