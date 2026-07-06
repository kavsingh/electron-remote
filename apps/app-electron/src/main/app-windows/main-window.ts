import path from "node:path";

import { app, BrowserWindow } from "electron";
import { scope } from "electron-log";

import { APP_RENDERER_URL } from "~/lib/app-protocol.ts";

import type { LoadURLOptions } from "electron";

const logger = scope("main-window");

async function loadWithAgent(win: BrowserWindow, url: string) {
	const options: LoadURLOptions = { userAgent: `App/${app.getVersion()}` };

	logger.info("loading url", JSON.stringify({ url, options }));

	return win.loadURL(url, options);
}

async function getRendererURL(isE2E: boolean) {
	const loadRemote = app.isPackaged || isE2E;

	if (!loadRemote && import.meta.env.MAIN_VITE_REMOTE_DEV_URL) {
		return import.meta.env.MAIN_VITE_REMOTE_DEV_URL;
	}

	const url = import.meta.env.MAIN_VITE_REMOTE_PROD_URL;

	try {
		await fetch(url, { method: "HEAD" });

		return url;
	} catch (cause) {
		logger.warn("remote url unavailable", { cause });

		return APP_RENDERER_URL;
	}
}

export function createMainWindow(ctx: { isE2E: boolean }) {
	const { isE2E } = ctx;
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.resolve(import.meta.dirname, "../preload/renderer.cjs"),
		},
		show: false,
	});

	void getRendererURL(isE2E).then((url) => loadWithAgent(mainWindow, url));

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
