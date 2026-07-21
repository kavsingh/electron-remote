import { execFile, spawn } from "node:child_process";
import path from "node:path";
import { promisify, styleText } from "node:util";

import type { ServerOptions } from "vite";

const devServerOptions: ServerOptions = { port: 5321, host: "0.0.0.0" };
const previewServerOptions: ServerOptions = { port: 5321, host: "0.0.0.0" };

// oxlint-disable-next-line typescript/strict-void-return
const execFileAsync = promisify(execFile);

async function build() {
	console.info(styleText(["dim"], "building app frontend..."));

	await execFileAsync("pnpm", ["turbo", "build", "--filter", "app-frontend"]);

	const outdir = path.resolve(import.meta.dirname, "dist");

	console.info(styleText(["bold"], `built app frontend to ${outdir}`));

	return outdir;
}

async function serve() {
	await build();

	console.info(styleText(["dim"], "starting app-frontend server..."));

	const proc = spawn("pnpm", ["turbo", "start", "--filter", "app-frontend"], {
		stdio: "inherit",
	});

	return function shutdown() {
		console.info(styleText(["dim"], "stopping app-frontend server..."));

		if (!proc.pid) {
			console.warn(
				styleText(
					["bold", "red"],
					"failed to stop app-frontend server: no pid found",
				),
			);

			return;
		}

		console.info(
			styleText(
				["dim"],
				`stopping app-frontend server with pid ${proc.pid}...`,
			),
		);

		proc.on("exit", (code, signal) => {
			let suffix = "";

			if (typeof code === "number") suffix = `: exit code ${code}`;
			else if (signal) suffix = `: signal ${signal}`;

			console.info(styleText(["bold"], `app-frontend server stopped${suffix}`));
		});

		proc.kill("SIGKILL");
	};
}

export { build, serve, devServerOptions, previewServerOptions };
