import { styleText } from "node:util";

import { serve as serveUi } from "app-ui/build";

import { execTurbo } from "./lib.ts";

async function globalSetup() {
	console.info(styleText(["dim"], "building electron bundle..."));

	await execTurbo("build --filter app-electron");

	console.info(styleText(["bold"], "electron bundle build complete"));

	return serveUi();
}

// oxlint-disable-next-line import/no-default-export
export default globalSetup;
