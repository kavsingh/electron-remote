import { styleText } from "node:util";

import { execTurbo, spawnTurbo } from "./lib.ts";

async function globalSetup() {
	console.info(styleText(["yellow"], "building app-electron..."));

	await execTurbo("build --filter app-electron");

	console.info(styleText(["bold", "green"], "app-electron build complete"));
	console.info(styleText(["yellow"], "building app-ui..."));

	await execTurbo("build --filter app-ui");

	console.info(styleText(["bold", "green"], "app-ui build complete"));
	console.info(styleText(["yellow"], "starting app-ui server..."));

	const uiProc = spawnTurbo("start --filter app-ui");

	return function globalTeardown() {
		console.info(styleText(["yellow"], "stopping app-ui server..."));

		if (!uiProc.pid) {
			console.warn(
				styleText(
					["bold", "red"],
					"failed to stop app-ui server: no pid found",
				),
			);

			return;
		}

		console.info(
			styleText(["yellow"], `stopping app-ui server with pid ${uiProc.pid}...`),
		);

		uiProc.on("exit", (code, signal) => {
			let suffix = "";

			if (typeof code === "number") suffix = `: exit code ${code}`;
			else if (signal) suffix = `: signal ${signal}`;

			console.info(
				styleText(["bold", "green"], `app-ui server stopped${suffix}`),
			);
		});

		uiProc.kill("SIGKILL");
	};
}

// oxlint-disable-next-line import/no-default-export
export default globalSetup;
