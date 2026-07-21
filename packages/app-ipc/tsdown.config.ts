import { defineConfig } from "tsdown";

import packageJson from "./package.json" with { type: "json" };

export default defineConfig([
	{
		clean: true,
		dts: { build: true, oxc: true },
		entry: "src/schema.ts",
		platform: "neutral",
		target: "es2022",
		format: ["esm"],
		define: { IPC_VERSION: JSON.stringify(packageJson.version) },
	},
	{
		dts: { build: true, oxc: true },
		entry: { preload: "src/preload.ts", electron: "src/electron.ts" },
		platform: "node",
		target: "node24",
		format: ["esm"],
		define: { IPC_VERSION: JSON.stringify(packageJson.version) },
	},
	{
		dts: { build: true, oxc: true },
		entry: "src/browser.ts",
		platform: "browser",
		target: "chrome130",
		format: ["esm"],
		define: { IPC_VERSION: JSON.stringify(packageJson.version) },
	},
]);
