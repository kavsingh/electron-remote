import path from "node:path";

import { app, BrowserWindow } from "electron";
import { scope } from "electron-log";
import { ResultAsync } from "neverthrow";

import { APP_RENDERER_URL as FALLBACK_URL } from "~/lib/app-protocol.ts";

import type { LoadURLOptions } from "electron";

const logger = scope("main-window");

async function loadWithAgent(win: BrowserWindow, url: string) {
	const options: LoadURLOptions = {
		userAgent: `${win.webContents.userAgent} App/${app.getVersion()}`,
	};

	logger.info("loading url", JSON.stringify({ url, options }));

	const result = await ResultAsync.fromPromise(
		win.loadURL(url, options),
		(cause) => new Error(`failed to load url: ${url}`, { cause }),
	);

	if (result.isOk()) return result;

	logger.error(result.error);

	return ResultAsync.fromPromise(
		win.loadURL(FALLBACK_URL, options),
		(cause) => new Error("failed to load fallback url", { cause }),
	);
}

export function createMainWindow(ctx: { isE2E: boolean }) {
	const { isE2E } = ctx;
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		show: false,
		webPreferences: {
			preload: path.resolve(import.meta.dirname, "preload-renderer.cjs"),
			additionalArguments: [`--app-version=${app.getVersion()}`],
		},
	});

	loadWithAgent(
		mainWindow,
		isE2E
			? import.meta.env.REMOTE_ENTRY_URL_E2E
			: import.meta.env.REMOTE_ENTRY_URL,
	).catch((cause) => logger.error(cause));

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
