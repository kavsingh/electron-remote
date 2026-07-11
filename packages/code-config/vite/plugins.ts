import bundleObfuscator from "vite-plugin-bundle-obfuscator";

import type { ConfigEnv, Plugin, PluginOption } from "vite";

function ensureProtected(protectedStrings: string[]): Plugin {
	return {
		name: "ensure-protected-strings",
		apply: "build",
		enforce: "post",
		generateBundle(_, bundle) {
			console.log("\nensuring protected strings are not present in bundle...");

			for (const output of Object.values(bundle)) {
				const code =
					output.type === "chunk" ? output.code : output.source.toString();

				if (protectedStrings.some((str) => !!str && code.includes(str))) {
					throw new Error(
						"obfuscation failed: protected string found in bundle",
					);
				}
			}
		},
	};
}

function obfuscator(
	mode: ConfigEnv["mode"],
	protectedStrings?: string[],
): PluginOption[] {
	// @ts-expect-error: types are wrong, but the plugin works
	const base: Plugin = bundleObfuscator({
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

	return protectedStrings?.length
		? [base, ensureProtected(protectedStrings)]
		: [base];
}

export { obfuscator };
