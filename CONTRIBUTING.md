# Contributing

Thank you for thinking about contributing! It is a small project that wants to grow and improve. We are always looking for new contributors to help us make it better. This document will help you get started.

## Development workflow

We use [pnpm](https://pnpm.io) as our package manager, so make sure to [install](https://pnpm.io/installation) it first.

```bash
git clone git@github.com:PhilDL/remix-ghost-stack.git
cd remix-ghost-stack
pnpm i
pnpm setup
pnpm build
```

This project heavily relies on third-party services like Ghost CMS, Stripe and SendGrid. There is unfortunately no test instance available for local development. You will need to create your own accounts and configure the project accordingly.
