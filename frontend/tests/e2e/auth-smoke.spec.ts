import { test, expect } from "@playwright/test";

test.describe("Auth page", () => {
  test("shows email input and disabled button by default", async ({ page }: { page: any }) => {
    await page.goto("/auth");
    const emailInput = page.getByPlaceholder("E-posta");
    await expect(emailInput).toBeVisible();

    const submitButton = page.getByRole("button", { name: "Devam" });
    await expect(submitButton).toBeDisabled();
  });

  test("enables button when email is valid", async ({ page }: { page: any }) => {
    await page.goto("/auth");
    const emailInput = page.getByPlaceholder("E-posta");
    await emailInput.fill("valid@example.com");

    const submitButton = page.getByRole("button", { name: "Devam" });
    await expect(submitButton).toBeEnabled();
  });
});

