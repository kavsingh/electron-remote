import { baseConfig } from "code-config/oxlint";
import playwright from "eslint-plugin-playwright";
import { defineConfig } from "oxlint";

export default defineConfig({
	extends: [baseConfig],
	ignorePatterns: [
		"dist/**",
		"reports/**",
		"**/__generated__/**",
		"!**/__generated__/__mocks__/**",
	],
	rules: { "import/no-relative-parent-imports": "off" },
	overrides: [
		{
			files: ["tests/**/*.test.ts"],
			jsPlugins: ["eslint-plugin-playwright"],
			rules: {
				...playwright.configs["flat/recommended"].rules,
				"playwright/no-skipped-test": ["error", { allowConditional: true }],
			},
		},
	],
});
