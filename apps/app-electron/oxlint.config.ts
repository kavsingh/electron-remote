import {
	baseConfig,
	reactConfig,
	tailwindcssConfig,
} from "code-config/oxlint-configs.ts";
import jestDom from "eslint-plugin-jest-dom";
import testingLibrary from "eslint-plugin-testing-library";
import { defineConfig } from "oxlint";

import type { OxlintConfig } from "oxlint";

const restrictImportsNode = {
	paths: [{ name: "react" }, { name: "react-dom" }, { name: "react-router" }],
	patterns: [
		{
			group: ["react-*", "tailwind-*", "electron-log/renderer"],
			allowTypeImports: true,
		},
	],
};

const restrictImportsBrowser = {
	paths: [
		{ name: "electron", allowTypeImports: true },
		{ name: "systeminformation", allowTypeImports: true },
	],
	patterns: [{ group: ["electron-log/main"], allowTypeImports: true }],
};

const tailwindcss = tailwindcssConfig({
	cwd: import.meta.dirname,
	entryPoint: "./src/renderer/index.css",
	files: ["./src/renderer/**/*.{ts,tsx}"],
});

const config: OxlintConfig = defineConfig({
	extends: [
		baseConfig,
		reactConfig({ files: ["./src/renderer/**/*.{ts,tsx}"] }),
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
			files: ["./build/**/*.{ts,js}"],
			rules: { "import/no-default-export": "off" },
		},

		{
			files: ["./src/**/*.{ts,tsx}"],
			rules: { "eslint/no-console": "error" },
		},

		{
			files: ["./src/common/**/*.{ts,tsx}"],
			env: { node: false, browser: false },
			rules: {
				"eslint/no-console": "error",
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictImportsBrowser.paths,
							...restrictImportsNode.paths,
						],
						patterns: [
							...restrictImportsBrowser.patterns,
							...restrictImportsNode.patterns,
						],
					},
				],
				"import/no-nodejs-modules": "error",
			},
		},

		{
			files: ["./src/main/**/*.ts"],
			env: { node: true, browser: false },
			rules: {
				"eslint/no-restricted-imports": ["error", restrictImportsNode],
			},
		},

		{
			files: ["./src/preload/**/*.ts"],
			env: { node: true, browser: true },
			rules: {
				"eslint/no-restricted-imports": [
					"error",
					{
						paths: [
							...restrictImportsBrowser.paths,
							...restrictImportsNode.paths,
						].filter(({ name }) => name !== "electron"),
						patterns: [
							...restrictImportsBrowser.patterns,
							...restrictImportsNode.patterns,
						],
					},
				],
			},
		},

		{
			files: ["./src/renderer/**/*.{ts,tsx}"],
			env: { node: false, browser: true },
			rules: {
				"eslint/no-restricted-imports": ["error", restrictImportsBrowser],

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
	],
});

export default config;
