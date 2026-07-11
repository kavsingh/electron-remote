import path from "node:path";

import { app, BrowserWindow } from "electron";
import { scope } from "electron-log";

import { APP_RENDERER_URL as FALLBACK_URL } from "~/lib/app-protocol.ts";

import type { LoadURLOptions } from "electron";

const logger = scope("main-window");

async function loadWithAgent(win: BrowserWindow, url: string) {
	const options: LoadURLOptions = {
		userAgent: `${win.webContents.userAgent} App/${app.getVersion()}`,
	};

	logger.info("loading url", JSON.stringify({ url, options }));

	try {
		await win.loadURL(url, options);
	} catch (cause) {
		logger.error("failed to load url", { cause, url });

		return win.loadURL(FALLBACK_URL, options);
	}
}

export function createMainWindow(ctx: { isE2E: boolean }) {
	const { isE2E } = ctx;
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.resolve(import.meta.dirname, "preload-renderer.cjs"),
		},
		show: false,
	});

	const url = app.isPackaged
		? import.meta.env.VITE_REMOTE_PROD_URL
		: import.meta.env.VITE_REMOTE_DEV_URL;

	void loadWithAgent(mainWindow, url);

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
