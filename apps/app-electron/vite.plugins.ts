import fs from "node:fs/promises";
import path from "node:path";

import { build as buildFrontend } from "app-frontend/build";

import type { Plugin } from "vite";

function prepareFrontend(dest: string): Plugin {
	return {
		name: "prepare-frontend",
		apply: "build",
		enforce: "post",
		async generateBundle() {
			console.info("\nbuilding frontend bundle...");

			const remoteDir = await buildFrontend();

			console.info("\ngathering frontend artifacts...");

			await fs.cp(remoteDir, dest, { recursive: true });

			console.info(`\nfrontend artifacts gathered to ${dest}`);
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

export { prepareFrontend };
