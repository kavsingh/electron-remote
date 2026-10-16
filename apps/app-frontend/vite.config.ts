import tailwindcss from "@tailwindcss/vite";
import { devtools } from "@tanstack/devtools-vite";
import { tanstackRouter } from "@tanstack/router-plugin/vite";
import react from "@vitejs/plugin-react";
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
			react({ compiler: true }),
			tailwindcss(),
			obfuscator(mode),
		],
	};
});
