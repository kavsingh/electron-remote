import { baseConfig } from "code-config/oxlint-configs.ts";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

const config: OxlintConfig = defineConfig({
	extends: [baseConfig],
	env: { node: true, browser: false },
	ignorePatterns: [
		"dist/**",
		"dist-*/**",
		"out/**",
		"reports/**",
		"**/*.gen.*",
		"**/__generated__/**",
		"!**/__generated__/__mocks__/**",
	],
	settings: { vitest: { typecheck: true } },
	overrides: [
		{
			files: ["./build/**/*.{ts,js}"],
			rules: { "import/no-default-export": "off" },
		},

		{
			files: ["./src/**/*.{ts,tsx}"],
			rules: { "eslint/no-console": "error" },
		},

		{
			files: ["./src/main/**/*.ts"],
			env: { node: true, browser: false },
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{ patterns: [{ group: ["electron-log/renderer"] }] },
				],
			},
		},

		{
			files: ["./src/preload/**/*.ts"],
			env: { node: true, browser: true },
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{ patterns: [{ group: ["electron-log/*"] }] },
				],
			},
		},

		{
			files: [
				"./src/**/__test-helpers__/**/*.{ts,tsx}",
				"./src/**/*.test.{ts,tsx}",
			],
			rules: {
				"typescript/unbound-method": "off",
				"typescript/no-non-null-assertion": "off",
				"typescript/no-unsafe-assignment": "off",
				"typescript/no-unsafe-call": "off",
				"typescript/no-unsafe-type-assertion": "off",
			},
		},

		{
			files: ["./src/**/*.test.{ts,tsx}", "./src/**/*.test-d.{ts,tsx}"],
			plugins: ["vitest"],
			rules: {
				"vitest/no-disabled-tests": "error",
				"vitest/no-focused-tests": "error",
				"vitest/no-import-node-test": "error",
				"vitest/require-mock-type-parameters": "off",
			},
		},
	],
});

export default config;
