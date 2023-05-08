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
          "align-center flex flex-col items-center justify-center rounded bg-gradient-to-br via-blue-800 from-saffron-500 to-pink-500 bg-no-repeat bg-cover",
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
            "flex flex-col w-full h-full gap-4 rounded bg-black/40 px-8 lg:py-16 py-8 text-white",
            backdropBlur && "backdrop-blur-md"
          )}
        >
          <h1 className="text-left text-4xl font-extrabold xl:text-5xl">
            {title}
          </h1>
          <p className="text-left">{description}</p>
          {showForm && (
            <div className="flex flex-col items-start justify-start gap-3 rounded">
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
