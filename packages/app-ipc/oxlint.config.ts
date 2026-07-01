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
		"import/no-relative-parent-imports": "off",
	},
	overrides: [
		{
			files: ["src/**"],
			env: { node: false, browser: false },
			rules: {
				"eslint/no-console": "error",
				"import/no-nodejs-modules": "error",
			},
		},
		{
			files: ["src/electron.ts", "src/preload.ts"],
			env: { node: true, browser: false },
			rules: { "import/no-nodejs-modules": "off" },
		},
		{
			files: ["src/browser.ts"],
			env: { node: false, browser: true },
		},
	],
});
