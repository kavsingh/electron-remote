import { styleText } from "node:util";

import { config } from "repo/config";
import { $ } from "zx";

async function globalSetup() {
	console.info(styleText(["bold"], "starting frontend server"));

	const proc = $({ cwd: config.frontendRoot })`pnpm start`;

	for await (const line of proc.stdout) {
		if (/local:\s+http:/i.test(String(line))) break;
	}

	return function globalTeardown() {
		console.info(styleText(["bold"], "shutting down frontend server"));

		return proc.kill("SIGTERM");
	};
}

// oxlint-disable-next-line import/no-default-export
export default globalSetup;
