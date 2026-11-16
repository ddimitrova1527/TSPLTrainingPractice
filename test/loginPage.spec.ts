import { test, expect } from "@playwright/test";

test("user can log in", async ({ page }) => {
  // Open login page
  await page.goto("http://localhost:5173/login");

  // Fill in credentials
  await page.getByPlaceholder("Email").fill("john@example.com");
  await page.getByPlaceholder("Password").fill("password123");

  // Click the login button
  await page.getByTestId("cs-login-submit").click();

  // User is edirected to the dashboard
  await expect(page).toHaveURL("http://localhost:5173/dashboard");

  // Title is visible
  await expect(page).toHaveTitle("City Services Portal");
});
