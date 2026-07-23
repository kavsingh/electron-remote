import path from "node:path";

import { obfuscator } from "code-config/vite/plugins";
import { config } from "repo/config";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

import { prepareFrontend } from "./vite.plugins.ts";

const outDir = path.dirname(config.electronEntry);

const mainConfig = defineConfig(({ mode }) => {
	return {
		resolve: { conditions: ["node", mode], tsconfigPaths: true },
		build: { outDir, minify: mode === "production" ? "terser" : false },
		plugins: [obfuscator(mode)],
		define: {
			"import.meta.env.REMOTE_ENTRY_URL": JSON.stringify(
				mode === "development"
					? `http://localhost:${config.frontendDevServerOptions.port}`
					: "http://localhost:5321",
			),
			"import.meta.env.REMOTE_ENTRY_URL_E2E": JSON.stringify(
				`http://localhost:${config.frontendPreviewServerOptions.port}`,
			),
		},
	};
});

const preloadConfig = defineConfig(({ mode }) => {
	return {
		resolve: { conditions: ["node", mode], tsconfigPaths: true },
		build: {
			outDir,
			minify: mode === "production" ? "terser" : false,
			rolldownOptions: {
				inlineDynamicImports: true,
				input: path.resolve(
					import.meta.dirname,
					"src/preload/preload-renderer.ts",
				),
				output: {
					format: "cjs",
					entryFileNames: "[name].cjs",
					chunkFileNames: "[name].cjs",
					assetFileNames: "[name].[ext]",
				},
			},
		},
	};
});

export { mainConfig };

export default defineConfig((configEnv) => {
	return {
		plugins: [
			electron([
				{ entry: "src/main/index.ts", vite: mainConfig(configEnv) },
				{ vite: preloadConfig(configEnv) },
			]),
			prepareFrontend(path.resolve(import.meta.dirname, "bundle/renderer")),
		],
	};
});
