import path from "node:path";

import { defineConfig } from "vite";
import electron from "vite-plugin-electron";

import { obfuscator, prepareRemoteUi } from "./vite.plugins.ts";

const mainConfig = defineConfig(({ mode }) => {
	return {
		resolve: { conditions: ["node", mode], tsconfigPaths: true },
		build: {
			minify: mode === "production" ? "terser" : false,
			outDir: path.resolve(import.meta.dirname, "bundle/electron"),
		},
		plugins: [obfuscator(mode)],
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
			prepareRemoteUi(path.resolve(import.meta.dirname, "bundle/renderer")),
		],
	};
});
