import { defineConfig } from "tsdown";

import packageJson from "./package.json" with { type: "json" };

export default defineConfig([
	{
		clean: true,
		dts: { build: true },
		entry: {
			schema: "src/schema.ts",
			preload: "src/preload.ts",
			electron: "src/electron.ts",
		},
		target: "node24",
		format: ["esm"],
		define: { IPC_VERSION: JSON.stringify(packageJson.version) },
	},
	{
		dts: { build: true },
		entry: "src/browser.ts",
		target: "chrome130",
		format: ["esm"],
		define: { IPC_VERSION: JSON.stringify(packageJson.version) },
	},
]);
