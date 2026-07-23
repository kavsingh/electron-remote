import babel from "@rolldown/plugin-babel";
import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import { obfuscator } from "code-config/vite/plugins";
import { config } from "repo/config";
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
	return {
		outDir: config.frontendBuildDir,
		server: config.frontendDevServerOptions,
		preview: config.frontendPreviewServerOptions,
		resolve: { conditions: ["browser", mode], tsconfigPaths: true },
		build: { cssMinify: mode === "production" },
		plugins: [
			devtools(),
			tanstackRouter(),
			react(),
			babel({
				presets: [reactCompilerPreset()],
				// https://github.com/rolldown/plugins/issues/10#issuecomment-4051567536
				include: [/\.(ts|tsx|js|jsx)$/],
			}),
			tailwindcss(),
			obfuscator(mode),
		],
	};
});
