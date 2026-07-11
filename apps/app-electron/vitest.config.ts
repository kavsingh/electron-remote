import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import { mainConfig } from "./vite.config.ts";

export default defineConfig((configEnv) => {
	return {
		test: {
			clearMocks: true,
			coverage: {
				include: [
					"src/**/*.{ts,tsx}",
					"!**/__generated__",
					"!**/__mocks__",
					"!**/__{test,spec}*__",
					"!**/{test,spec}.*",
					"!**/types.*",
				],
				reporter: "lcov",
				reportsDirectory: "./reports/coverage",
			},
			projects: [
				mergeConfig(
					mainConfig(configEnv),
					defineProject({
						test: {
							name: "main",
							environment: "node",
							include: [
								"src/{main,common,preload}/**/*.{test,spec}.?(m|c)[tj]s?(x)",
							],
							setupFiles: ["./src/vitest.node.setup.ts"],
						},
					}),
				),
			],
		},
	};
});
