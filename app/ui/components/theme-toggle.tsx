import React from "react";
import ThemeToggleIcon from "./theme-toggle-icon";
import { cn } from "~/ui/utils";
import { Theme, useTheme } from "~/ui/utils/theme-provider";

const themes = [Theme.LIGHT, Theme.DARK];

export const ThemeToggle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLLabelElement>) => {
  const [theme, setTheme] = useTheme();

  function handleChange() {
    setTheme((prevTheme) =>
      prevTheme === Theme.LIGHT ? Theme.DARK : Theme.LIGHT
    );
  }

  return (
    <>
      {themes.map((t) => (
        <label
          key={t}
          className={cn(
            "inline-flex h-9 cursor-pointer items-center justify-center rounded-md px-3 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
            className
          )}
          {...props}
        >
          <ThemeToggleIcon theme={t} checked={theme === t} />
          <input
            type="radio"
            name="theme-toggle"
            className="absolute inset-0 z-[-1] opacity-0"
            checked={theme === t}
            value={t}
            title={`Use ${t} theme`}
            aria-label={`Use ${t} theme`}
            onChange={handleChange}
          />
        </label>
      ))}
    </>
  );
};

export default ThemeToggle;
