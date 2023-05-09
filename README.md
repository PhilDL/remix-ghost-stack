# Remix Ghost Stack

> **Warning**
> This is still a work in progress, documentation is not ready

![remix-ghost-stack](https://user-images.githubusercontent.com/4941205/236985478-47c33abb-bfda-41e7-8c41-17593ebf0ac4.png)

## Tech in the stack

- [Fly app deployment](https://fly.io) with [Docker](https://www.docker.com/)
- Fully type-safe interaction with Ghost Content and Admin API thanks to [@ts-ghost](https://github.com/PhilDL/ts-ghost)
- Database ORM with [Prisma](https://prisma.io) and [SQLite](https://www.sqlite.org/index.html)
- Healthcheck endpoint for [Fly backups region fallbacks](https://fly.io/docs/reference/configuration/#services-http_checks)
- [GitHub Actions](https://github.com/features/actions) for deploy on merge to production and staging environments
- Styling with [Tailwind](https://tailwindcss.com/)
- Beautiful components with [shadcn ui](https://github.com/shadcn/ui)
- Local third party request mocking with [MSW](https://mswjs.io)
- Unit testing with [Vitest](https://vitest.dev) and [Testing Library](https://testing-library.com)
- Code formatting with [Prettier](https://prettier.io) and + Tailwind Prettier-Plugin.
- Linting with [ESLint](https://eslint.org)
- Static Types with [TypeScript](https://typescriptlang.org)

## Stack Features

- [Ghost](https://ghost.org/) CMS Pages, Posts, Authors, Tags
- [Stripe Subscriptions](https://stripe.com/docs/billing/subscriptions/overview) connects to your Ghost instance and the products you configured there.
- Authentication Ready with [Remix-Auth](https://www.npmjs.com/package/remix-auth), [Remix Auth OTP](https://github.com/dev-xo/remix-auth-otp). Created to mimic the Ghost Membership login flow with magic link but also adding the convinience of a token Code.
- Beautiful emails with [React Emails](https://github.com/resendlabs/react-email), for Signup and Signin actions
- Domain separated logic with [domain functions](https://github.com/seasonedcc/domain-functions)

## Development

- This step only applies if you've opted out of having the CLI install dependencies for you:

  ```sh
  npx remix init
  ```

- Initial setup: _If you just generated this project, this step has been done for you._

  ```sh
  pnpm run setup
  ```

- Start dev server:

  ```sh
  pnpm run dev
  ```

This starts your app in development mode, rebuilding assets on file changes.

### Relevant code:

This is a pretty simple note-taking app, but it's a good example of how you can build a full stack app with Prisma and Remix. The main functionality is creating users, logging in and out, and creating and deleting notes.

## Deployment

This Remix Stack comes with two GitHub Actions that handle automatically deploying your app to production and staging environments.

Prior to your first deployment, you'll need to do a few things:

- [Install Fly](https://fly.io/docs/getting-started/installing-flyctl/)

- Sign up and log in to Fly

  ```sh
  fly auth signup
  ```

  > **Note:** If you have more than one Fly account, ensure that you are signed into the same account in the Fly CLI as you are in the browser. In your terminal, run `fly auth whoami` and ensure the email matches the Fly account signed into the browser.

- Create two apps on Fly, one for staging and one for production:

  ```sh
  fly apps create remix-ghost-stack
  fly apps create remix-ghost-stack-staging
  ```

  > **Note:** Make sure this name matches the `app` set in your `fly.toml` file. Otherwise, you will not be able to deploy.

  - Initialize Git.

  ```sh
  git init
  ```

- Create a new [GitHub Repository](https://repo.new), and then add it as the remote for your project. **Do not push your app yet!**

  ```sh
  git remote add origin <ORIGIN_URL>
  ```

- Add a `FLY_API_TOKEN` to your GitHub repo. To do this, go to your user settings on Fly and create a new [token](https://web.fly.io/user/personal_access_tokens/new), then add it to [your repo secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) with the name `FLY_API_TOKEN`.

- Add a `SESSION_SECRET` to your fly app secrets, to do this you can run the following commands:

  ```sh
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-ghost-stack
  fly secrets set SESSION_SECRET=$(openssl rand -hex 32) --app remix-ghost-stack-staging
  fly secrets set MAGIC_LINK_SECRET=$(openssl rand -hex 32) --app remix-ghost-stack
  fly secrets set MAGIC_LINK_SECRET=$(openssl rand -hex 32) --app remix-ghost-stack-staging
  fly secrets set APP_URL="https://remix-ghost-stack.fly.dev" --app remix-ghost-stack
  fly secrets set APP_URL="https://remix-ghost-stack-staging.fly.dev" --app remix-ghost-stack-staging
  ```

  If you don't have openssl installed, you can also use [1password](https://1password.com/password-generator/) to generate a random secret, just replace `$(openssl rand -hex 32)` with the generated secret.

#### Add secrets for third party services

- Your Ghost Instance credentials:

  ```sh
  fly secrets set GHOST_URL="https://codingdodo-staging.digitalpress.blog" --app remix-ghost-stack
  fly secrets set GHOST_CONTENT_API_KEY="eb5378f191161d77c929390ec3" --app remix-ghost-stack
  fly secrets set GHOST_ADMIN_API_KEY="6409fafbc1a9d5304fd33bfe:006bb51fc482117d5d2f8f7a1445643f97875817c600aeea2bf1e9b4c3d4255e" --app remix-ghost-stack
  ```

- Your Stripe credentials:

  ```sh
  fly secrets set STRIPE_SECRET_KEY="sk_live_03ijahdiuahzdi09ADnkjazd09098AZDnkjankjdad09AD09nkjad" --app remix-ghost-stack
  fly secrets set STRIPE_PUBLIC_KEY="pk_live_03IjdaoOIZAdjoasddVc4W8Tw8x6Wlg03CdasdjpKh3Ly8OAIJDksXatOGW4mavULAmwSrX2GqgXBK0JlU7r00xc2cASgW" --app remix-ghost-stack
  fly secrets set STRIPE_WEBHOOK_SIGNATURE="whsec_b6b7742fakzjndkjan5alzkjdkal528f048eae63e4akzjndc7165aiozdj4e14019252ad" --app remix-ghost-stack
  ```

- Your Sendgrid API Key

  ```sh
  fly secrets set SENDGRID_API_KEY="SG.d1azdjijazaslkd2O_OiuNFSlJQ.FoJADIJZHIAHIUAZaskdjIHw8dci--SdJazjkdnuL3ORhrw" --app remix-ghost-stack
  ```

- Create a persistent volume for the sqlite database for both your staging and production environments. Run the following:

  ```sh
  fly volumes create data --size 1 --app remix-ghost-stack
  fly volumes create data --size 1 --app remix-ghost-stack-staging
  ```

Now that everything is set up you can commit and push your changes to your repo. Every commit to your `main` branch will trigger a deployment to your production environment, and every commit to your `dev` branch will trigger a deployment to your staging environment.

### Connecting to your database

The sqlite database lives at `/data/sqlite.db` in your deployed application. You can connect to the live database by running `fly ssh console -C database-cli`.

### Getting Help with Deployment

If you run into any issues deploying to Fly, make sure you've followed all of the steps above and if you have, then post as many details about your deployment (including your app name) to [the Fly support community](https://community.fly.io). They're normally pretty responsive over there and hopefully can help resolve any of your deployment issues and questions.

## GitHub Actions

We use GitHub Actions for continuous integration and deployment. Anything that gets into the `main` branch will be deployed to production after running tests/build/etc. Anything in the `dev` branch will be deployed to staging.

## Testing

### Playwright

Write doc

### Vitest

For lower level tests of utilities and individual components, we use `vitest`. We have DOM-specific assertion helpers via [`@testing-library/jest-dom`](https://testing-library.com/jest-dom).

### Type Checking

This project uses TypeScript. It's recommended to get TypeScript set up for your editor to get a really great in-editor experience with type checking and auto-complete. To run type checking across the whole project, run `pnpm run typecheck`.

### Linting

This project uses ESLint for linting. That is configured in `.eslintrc.js`.

### Formatting

We use [Prettier](https://prettier.io/) for auto-formatting in this project. It's recommended to install an editor plugin (like the [VSCode Prettier plugin](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)) to get auto-formatting on save. There's also a `pnpm run format` script you can run to format all files in the project.

- Tailwind prettier plugin
- Sort inports

### Aknowledgements

- The theme was inspired by the amazing Ghost themes from [Biron Themes](https://bironthemes.com)
- The stripe integration was **heavily** inspired by another amazing Remix template by dev-xo, [Stripe Stack](https://github.com/dev-xo/stripe-stack)
