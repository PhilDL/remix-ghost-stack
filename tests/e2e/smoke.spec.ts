import { test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", {
      name: "Technical article lorem ipsum sit amet.",
    })
    .nth(1)
    .click();
  await page
    .getByRole("link", {
      name: "SUBSCRIBE",
    })
    .click();
  await page
    .getByRole("link", {
      name: "Already have an account ?",
    })
    .click();
});
