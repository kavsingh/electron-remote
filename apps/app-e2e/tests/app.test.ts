import { test, expect } from "./fixtures.ts";

test.describe("app load", () => {
	test("should load at home page", async ({ page }) => {
		await expect(page.getByRole("heading", { name: "Home" })).toBeVisible();
	});
});
