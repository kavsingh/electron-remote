import {
	baseConfig,
	reactConfig,
	tailwindcssConfig,
} from "code-config/oxlint.ts";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

const tailwindcss = tailwindcssConfig({
	cwd: import.meta.dirname,
	entryPoint: "index.css",
	files: ["./components/**/*.{ts,tsx}"],
});

const config: OxlintConfig = defineConfig({
	extends: [
		baseConfig,
		reactConfig({
			files: ["./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
		}),
	],
	env: { node: true, browser: false },
	ignorePatterns: [
		"dist/**",
		"out/**",
		"reports/**",
		"**/*.gen.*",
		"**/__generated__/**",
		"!**/__generated__/__mocks__/**",
	],
	settings: { vitest: { typecheck: true }, ...tailwindcss.settings },
	overrides: [
		{
			files: ["./components/**/*.{ts,tsx}", "./hooks/**/*.{ts,tsx}"],
			env: { node: false, browser: true },
			rules: {
				"eslint/no-console": "error",

				"import/no-nodejs-modules": "error",
				"import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
			},
		},

		...(tailwindcss.overrides ?? []),
	],
});

export default config;
