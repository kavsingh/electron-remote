import path from "node:path";

import { devServerOptions, previewServerOptions } from "app-frontend/build";
import { obfuscator } from "code-config/vite/plugins.ts";
import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

import { prepareFrontend } from "./vite.plugins.ts";

const mainConfig = defineConfig(({ mode }) => {
	return {
		resolve: { conditions: ["node", mode], tsconfigPaths: true },
		build: {
			minify: mode === "production" ? "terser" : false,
			outDir: path.resolve(import.meta.dirname, "bundle/electron"),
		},
		plugins: [obfuscator(mode)],
		define: {
			REMOTE_ENTRY_URL: JSON.stringify(
				mode === "development"
					? `http://localhost:${devServerOptions.port}`
					: "http://localhost:5321",
			),
			REMOTE_ENTRY_URL_E2E: JSON.stringify(
				`http://localhost:${previewServerOptions.port}`,
			),
		},
	};
});

const preloadConfig = defineConfig(({ mode }) => {
	return {
		resolve: { conditions: ["node", mode], tsconfigPaths: true },
		build: {
			minify: mode === "production" ? "terser" : false,
			outDir: path.resolve(import.meta.dirname, "bundle/electron"),
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
