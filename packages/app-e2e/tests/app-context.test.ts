import { Page } from "@playwright/test";

import { test, expect } from "./fixtures.ts";

function selectLoadingPageHeader(page: Page) {
	return page.getByRole("heading", { name: "Loading" });
}

function selectMainAppHeader(page: Page) {
	return page.getByRole("heading", { name: "System Info" });
}

test.describe("app context switching", () => {
	test("should open at loading by default", async ({ page }) => {
		await expect(selectLoadingPageHeader(page)).toBeVisible();
		await expect(selectMainAppHeader(page)).toBeHidden();
	});

	test("should load and unload main", async ({ page }) => {
		await page.getByRole("button", { name: "Load main" }).click();

		await expect(selectMainAppHeader(page)).toBeVisible();
		await expect(selectLoadingPageHeader(page)).toBeHidden();

		await page.getByRole("button", { name: "Unload" }).click();

		await expect(selectLoadingPageHeader(page)).toBeVisible();
		await expect(selectMainAppHeader(page)).toBeHidden();
	});
});
