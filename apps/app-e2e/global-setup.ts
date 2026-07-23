import { spawn } from "node:child_process";
import { styleText } from "node:util";

import { config } from "repo/config";
import waitOn from "wait-on";

async function globalSetup() {
	console.info(styleText(["bold"], "starting frontend server"));

	const proc = spawn("pnpm", ["start"], {
		cwd: config.frontendRoot,
		stdio: "inherit",
	});

	await waitOn({
		resources: [`http://localhost:${config.frontendPreviewServerOptions.port}`],
		timeout: 3_000,
	});

	return function globalTeardown() {
		console.info(styleText(["bold"], "shutting down frontend server"));
		proc.kill();
	};
}

// oxlint-disable-next-line import/no-default-export
export default globalSetup;
