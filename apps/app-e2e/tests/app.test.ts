import { test, expect } from "./fixtures.ts";

test.describe("app load", () => {
	test("should load", async ({ page }) => {
		await expect(
			page.getByRole("heading", { name: "System Info" }),
		).toBeVisible();
	});
});
