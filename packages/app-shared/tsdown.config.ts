import { defineConfig } from "tsdown";

import packageJson from "./package.json" with { type: "json" };

export default defineConfig([
	{
		clean: true,
		dts: { build: true, oxc: true },
		unbundle: true,
		entry: "common/index.ts",
		outDir: "dist/common",
		platform: "neutral",
		target: "es2022",
		format: ["esm"],
		define: { LIB_VERSION: JSON.stringify(packageJson.version) },
	},
]);
