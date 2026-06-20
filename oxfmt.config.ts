import { defineConfig } from "oxfmt";

export default defineConfig({
	ignorePatterns: [
		"**/.turbo/**",
		"**/dist/**",
		"**/out/**",
		"**/gen/**",
		"**/dist-*/**",
		"**/reports/**",
		"**/target/**",
		"**/*.gen.*",
		"**/__generated__/**",
		"!**/__generated__/mocks/**",
		"**/pnpm-*.yaml",
	],
	printWidth: 80,
	useTabs: true,
	sortImports: {
		order: "asc",
		groups: [
			["builtin"],
			["external"],
			["subpath", "internal"],
			["parent"],
			["sibling", "index"],
			["type"],
		],
	},
	overrides: [
		{ files: ["*.{json,jsonc}"], options: { trailingComma: "none" } },
	],
});
