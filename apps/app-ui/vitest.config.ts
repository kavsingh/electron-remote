import { defineConfig, defineProject, mergeConfig } from "vitest/config";

import defineBaseConfig from "./vite.config.ts";

export default defineConfig((configEnv) => {
	const baseConfig = defineBaseConfig(configEnv);

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
					// oxlint-disable-next-line typescript/no-unsafe-type-assertion
					baseConfig as Record<string, unknown>,
					defineProject({
						resolve: { conditions: ["development", "browser"] },
						test: {
							name: "app-ui",
							environment: "jsdom",
							include: ["src/**/*.{test,spec}.?(m|c)[tj]s?(x)"],
							setupFiles: ["./src/vitest.setup.ts"],
						},
					}),
				),
			],
		},
	};
});
