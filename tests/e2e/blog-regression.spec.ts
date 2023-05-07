import { test } from "@playwright/test";

test("test", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("link", {
      name: "Odoo 16 JavaScript Tutorial: OWL Field Widgets reference and full example.",
    })
    .nth(1)
    .click();
  await page
    .getByRole("link", {
      name: "Coding Dodo - Odoo, Python & JavaScript Tutorials",
    })
    .click();
  await page
    .getByRole("link", {
      name: "Philippe L'ATTENTION Philippe L'ATTENTION 18 Nov 2022",
    })
    .click();
  await page.getByRole("link", { name: "Odoo 16", exact: true }).click();
});
