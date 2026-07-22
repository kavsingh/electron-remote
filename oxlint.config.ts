import { baseConfig } from "code-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
	ignorePatterns: [
		".turbo/*",
		".temp/*",
		"target/*",
		"apps/*",
		"packages/*",
		"pnpm-*.yaml",
	],
	extends: [baseConfig],
});
