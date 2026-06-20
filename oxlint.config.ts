import { baseConfig } from "code-config/oxlint-configs.ts";
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
