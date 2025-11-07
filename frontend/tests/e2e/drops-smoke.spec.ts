import { test, expect } from "@playwright/test";

test.describe("Drops page", () => {
  test("renders drop list heading", async ({ page }: { page: any }) => {
    await page.goto("/drops");
    await expect(page.getByRole("heading", { name: /drops/i })).toBeVisible();
  });

  test("renders drop cards with neon styling", async ({
    page,
  }: {
    page: any;
  }) => {
    await page.goto("/drops");
    const cards = page.locator(".card--drop");
    await expect(cards.first()).toBeVisible({ timeout: 15_000 });
    await expect(cards.first()).toHaveClass(/card--drop/);
  });
});
