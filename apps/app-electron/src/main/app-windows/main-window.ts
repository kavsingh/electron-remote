import path from "node:path";

import { AppContext } from "app-shared/common/app.ts";
import { app, BrowserWindow } from "electron";

import { APP_RENDERER_URL } from "~/lib/app-protocol.ts";
import { AppStore } from "~/stores/app.ts";

function loadWithAgent(win: BrowserWindow, url: string) {
	return win.loadURL(url, { userAgent: `App/${app.getVersion()}` });
}

function getRendererURL(appContext: AppContext, isE2E: boolean) {
	if (app.isPackaged || isE2E) {
		return appContext === "main"
			? import.meta.env.MAIN_VITE_REMOTE_PROD_URL
			: APP_RENDERER_URL;
	}

	if (
		import.meta.env.MAIN_VITE_REMOTE_DEV_URL &&
		process.env["ELECTRON_RENDERER_URL"]
	) {
		return appContext === "main"
			? import.meta.env.MAIN_VITE_REMOTE_DEV_URL
			: process.env["ELECTRON_RENDERER_URL"];
	}

	throw new Error("No entry point available");
}

export function createMainWindow(ctx: { isE2E: boolean; appStore: AppStore }) {
	const { isE2E, appStore } = ctx;
	let appContext = appStore.getState().appContext;
	const mainWindow = new BrowserWindow({
		titleBarStyle: "hiddenInset",
		width: 800,
		height: 600,
		webPreferences: {
			preload: path.resolve(import.meta.dirname, "../preload/renderer.cjs"),
		},
		show: false,
	});

	void loadWithAgent(mainWindow, getRendererURL(appContext, isE2E));

	ctx.appStore.addListener("update", () => {
		const nextContext = ctx.appStore.getState().appContext;

		if (nextContext === appContext) return;

		appContext = nextContext;
		void loadWithAgent(mainWindow, getRendererURL(appContext, isE2E));
	});

	if (import.meta.env.DEV && !isE2E) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}

	return mainWindow;
}
