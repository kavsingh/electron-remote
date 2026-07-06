import { execFile, spawn } from "node:child_process";
import path from "node:path";
import { promisify, styleText } from "node:util";

// oxlint-disable-next-line typescript/strict-void-return
const execFileAsync = promisify(execFile);

async function build() {
	console.info(styleText(["dim"], "building app ui..."));

	await execFileAsync("pnpm", [
		"turbo",
		"build",
		"--force",
		"--filter",
		"app-ui",
	]);

	const outdir = path.resolve(import.meta.dirname, "dist");

	console.info(styleText(["bold"], `built app ui to ${outdir}`));

	return outdir;
}

async function serve() {
	await build();

	console.info(styleText(["dim"], "starting app-ui server..."));

	const proc = spawn("pnpm", ["turbo", "start", "--filter", "app-ui"], {
		stdio: "inherit",
	});

	return function shutdown() {
		console.info(styleText(["dim"], "stopping app-ui server..."));

		if (!proc.pid) {
			console.warn(
				styleText(
					["bold", "red"],
					"failed to stop app-ui server: no pid found",
				),
			);

			return;
		}

		console.info(
			styleText(["dim"], `stopping app-ui server with pid ${proc.pid}...`),
		);

		proc.on("exit", (code, signal) => {
			let suffix = "";

			if (typeof code === "number") suffix = `: exit code ${code}`;
			else if (signal) suffix = `: signal ${signal}`;

			console.info(styleText(["bold"], `app-ui server stopped${suffix}`));
		});

		proc.kill("SIGKILL");
	};
}

export { build, serve };
