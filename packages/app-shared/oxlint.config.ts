import { baseConfig } from "code-config/oxlint-configs.ts";
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
		"import/no-nodejs-modules": "error",
		"import/no-relative-parent-imports": "off",
	},
	overrides: [
		{
			files: ["common/**", "node/**", "browser/**"],
			rules: { "eslint/no-console": "error" },
		},
		{
			files: ["node/**"],
			env: { node: true, browser: false },
			rules: { "import/no-nodejs-modules": "off" },
		},
		{ files: ["common/**"], env: { node: false, browser: false } },
		{ files: ["browser/**"], env: { node: false, browser: true } },
	],
});
