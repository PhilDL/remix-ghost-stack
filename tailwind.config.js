const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      aria: {
        current: 'current="page"',
      },
      fontFamily: {
        sans: ["Rubik", ...defaultTheme.fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "code::before": { content: "" },
            "code::after": { content: "" },
            code: {
              backgroundColor: theme("colors.slate.200"),
              padding: "0.1rem 0.3rem",
              borderRadius: "0.2rem",
              fontWeight: "500",
            },
          },
        },
        invert: {
          css: {
            code: {
              backgroundColor: theme("colors.slate.700"),
            },
          },
        },
      }),
      colors: {
        cornflower: {
          DEFAULT: "#7550F7",
          50: "#FFFFFF",
          100: "#F0ECFE",
          200: "#D1C5FC",
          300: "#B39EFB",
          400: "#9477F9",
          500: "#7550F7",
          600: "#4B1AF5",
          700: "#3509CD",
          800: "#270798",
          900: "#190462",
          950: "#120347",
        },
        saffron: {
          DEFAULT: "#F4BE41",
          50: "#FEF9EF",
          100: "#FDF3DB",
          200: "#FBE6B5",
          300: "#F8D88E",
          400: "#F6CB68",
          500: "#F4BE41",
          600: "#EFAB0E",
          700: "#BA850B",
          800: "#855F08",
          900: "#503905",
          950: "#352603",
        },
        border: "hsl(var(--border) / <alpha-value>)",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        link: "hsl(var(--link-foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animate"),
  ],
};
