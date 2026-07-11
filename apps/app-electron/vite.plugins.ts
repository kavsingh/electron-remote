import fs from "node:fs/promises";
import path from "node:path";

import { build as buildRemoteUi } from "app-ui/build";
import bundleObfuscator from "vite-plugin-bundle-obfuscator";

import type { ConfigEnv, Plugin } from "vite";

function prepareRemoteUi(dest: string): Plugin {
	return {
		name: "prepare-remote-ui",
		apply: "build",
		enforce: "post",
		async generateBundle() {
			console.info("\nbuilding remote ui bundle...");

			const remoteDir = await buildRemoteUi();

			console.info("\ngathering remote ui artifacts...");

			await fs.cp(remoteDir, dest, { recursive: true });

			console.info(`\nremote ui artifacts gathered to ${dest}`);
			console.info(`\ncleaning up built-in renderer...`);

			await Promise.allSettled(
				[
					path.resolve(import.meta.dirname, "dist/index.html"),
					path.resolve(import.meta.dirname, "index.html"),
				].map((p) => fs.rm(p, { recursive: false, force: true })),
			);
		},
	};
}

function obfuscator(
	mode: ConfigEnv["mode"],
	protectedStrings?: string[],
): Plugin {
	// @ts-expect-error errant type exports upstream
	// oxlint-disable-next-line typescript/no-unsafe-return
	return bundleObfuscator({
		enable: mode === "production",
		apply: "build",
		excludes: [/node_modules/],
		options: {
			optionsPreset: "default",
			sourceMap: true,
			...(protectedStrings?.length
				? {
						forceTransformStrings: protectedStrings,
						stringArrayEncoding: ["base64"],
					}
				: {}),
		},
	});
}

export { prepareRemoteUi, obfuscator };
