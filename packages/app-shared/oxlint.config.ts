import { baseConfig } from "code-config/oxlint";
import { defineConfig } from "oxlint";

export default defineConfig({
	extends: [baseConfig],
	env: { node: true, browser: false },
	ignorePatterns: [
		"dist/**",
		"reports/**",
		"**/__generated__/**",
		"!**/__generated__/__mocks__/**",
	],
	rules: {
		"import/no-relative-parent-imports": "off",
	},
	overrides: [
		{
			files: ["common/**", "node/**", "browser/**"],
			rules: { "eslint/no-console": "error" },
		},
		{
			files: ["common/**", "browser/**"],
			rules: { "import/no-nodejs-modules": "error" },
		},
		{ files: ["common/**"], env: { node: false, browser: false } },
		{ files: ["browser/**"], env: { node: false, browser: true } },
	],
});
