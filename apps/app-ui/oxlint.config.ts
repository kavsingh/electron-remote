import {
	baseConfig,
	reactConfig,
	tailwindcssConfig,
} from "code-config/oxlint-configs.ts";
import jestDom from "eslint-plugin-jest-dom";
import playwright from "eslint-plugin-playwright";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

const tailwindcss = tailwindcssConfig({
	cwd: import.meta.dirname,
	entryPoint: "./src/index.css",
	files: ["./src/**/*.{ts,tsx}"],
});

const config: OxlintConfig = defineConfig({
	extends: [baseConfig, reactConfig({ files: ["./src/**/*.{ts,tsx}"] })],
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
			files: ["./src/**/*.{ts,tsx}"],
			env: { node: false, browser: true },
			rules: {
				"eslint/no-console": "error",

				"import/no-nodejs-modules": "error",
				"import/no-unassigned-import": ["error", { allow: ["**/*.css"] }],
			},
		},

		...(tailwindcss.overrides ?? []),

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

		{
			files: [
				"./src/renderer/**/*.test.{ts,tsx}",
				"./src/renderer/**/*.test-d.{ts,tsx}",
			],
			jsPlugins: ["eslint-plugin-jest-dom", "eslint-plugin-testing-library"],
			rules: {
				...jestDom.configs["flat/recommended"].rules,
				...testingLibrary.configs["flat/react"].rules,
			},
		},

		{
			files: ["./e2e/**/*.test.ts"],
			jsPlugins: ["eslint-plugin-playwright"],
			rules: { ...playwright.configs["flat/recommended"].rules },
		},
	],
});

export default config;
