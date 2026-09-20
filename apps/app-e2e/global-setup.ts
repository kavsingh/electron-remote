import { styleText } from "node:util";

import { config } from "repo/config";
import { $, ProcessOutput } from "zx";

async function globalSetup() {
	console.info(styleText("dim", "starting frontend server..."));

	const proc = $({ cwd: config.frontendRoot })`pnpm start`;

	for await (const line of proc.stdout) {
		if (/local:\s+http:/i.test(String(line))) {
			console.info(styleText("bold", "frontend server started"));
			break;
		}
	}

	return async function globalTeardown() {
		console.info(styleText("dim", "shutting down frontend server..."));

		void proc.kill("SIGTERM");

		try {
			await proc;
		} catch (cause) {
			const isExpectedExit =
				cause instanceof ProcessOutput && cause.signal === "SIGTERM";

			// oxlint-disable-next-line eslint-js/no-restricted-syntax
			if (!isExpectedExit) throw cause;
		}

		console.info(styleText("bold", "frontend server shut down"));
	};
}

// oxlint-disable-next-line import/no-default-export
export default globalSetup;
