import bundleObfuscator from "vite-plugin-bundle-obfuscator";

import type { ConfigEnv, Plugin } from "vite";

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

export { obfuscator };
