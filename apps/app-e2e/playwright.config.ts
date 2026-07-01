import { fileURLToPath } from "node:url";

import { defineConfig } from "@playwright/test";

export default defineConfig({
	globalSetup: fileURLToPath(import.meta.resolve("./global-setup.ts")),
	projects: [{ name: "tests", testDir: "tests", testMatch: "**/*.test.ts" }],
	outputDir: "reports/results",
	reporter: process.env["CI"]
		? [["github"], ["html", { outputFolder: "reports/html", open: "never" }]]
		: [["list"], ["html", { outputFolder: "reports/html", open: "never" }]],
});
