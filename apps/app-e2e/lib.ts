import { spawn, execFile } from "node:child_process";
import path from "node:path";
import util from "node:util";

import type { SpawnOptionsWithoutStdio } from "node:child_process";

// oxlint-disable-next-line typescript/strict-void-return
const execFileAsync = util.promisify(execFile);

const repoRoot = path.resolve(import.meta.dirname, "../../");
const appElectronPath = path.resolve(repoRoot, "apps/app-electron");
const appFrontendPath = path.resolve(repoRoot, "apps/app-frontend");

function execTurbo(cmd: string) {
	return execFileAsync("pnpm", ["turbo", ...cmd.split(" ")], {
		cwd: repoRoot,
	});
}

function spawnTurbo(cmd: string, options?: SpawnOptionsWithoutStdio) {
	return spawn("pnpm", ["turbo", ...cmd.split(" ")], {
		...options,
		cwd: repoRoot,
		env: { ...process.env, ...options?.env },
	});
}

export {
	repoRoot,
	appElectronPath,
	appFrontendPath,
	execFileAsync,
	execTurbo,
	spawnTurbo,
};
