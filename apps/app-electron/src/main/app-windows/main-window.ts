import path from "node:path";

import { app, BrowserWindow } from "electron";
import { scope } from "electron-log";

import { APP_RENDERER_URL } from "~/lib/app-protocol.ts";

import type { LoadURLOptions } from "electron";

interface RendererURL {
	primary: string;
	fallback: string;
}

const logger = scope("main-window");

async function loadWithAgent(win: BrowserWindow, url: RendererURL) {
	const options: LoadURLOptions = {
		userAgent: `${win.webContents.userAgent} App/${app.getVersion()}`,
	};

	logger.info("loading url", JSON.stringify({ url, options }));

	try {
		await win.loadURL(url.primary, options);
	} catch (cause) {
		logger.error("failed to load url", { cause, url: url });
		logger.info("loading fallback url", url.fallback);

		return win.loadURL(url.fallback, options);
	}
}

function getRendererURL(isE2E: boolean): RendererURL {
	const loadRemote = app.isPackaged || isE2E;

	if (!loadRemote) {
		return {
			primary: import.meta.env.MAIN_VITE_REMOTE_DEV_URL,
			fallback: process.env.ELECTRON_RENDERER_URL ?? "",
		};
	}

	return {
		primary: import.meta.env.MAIN_VITE_REMOTE_PROD_URL,
		fallback: APP_RENDERER_URL,
	};
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

	void loadWithAgent(mainWindow, getRendererURL(isE2E));

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
