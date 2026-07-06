import { app, BrowserWindow, protocol } from "electron";
import logger from "electron-log";

import { createMainWindow } from "./app-windows/main-window.ts";
import { initPubSub, registerIpcHandlers } from "./ipc.ts";
import { appProtocolHandler, appProtocol } from "./lib/app-protocol.ts";
import { initLogging } from "./lib/init-logging.ts";
import { restrictNavigation } from "./lib/restrict-navigation.ts";
import { createAppStore } from "./stores/app.ts";
import { createSystemStatsStore } from "./stores/system-stats.ts";

const isE2E = process.argv.slice(2).includes("--e2e");

app.enableSandbox();
protocol.registerSchemesAsPrivileged([appProtocol]);
initLogging();

const appStore = createAppStore();
const systemStatsStore = createSystemStatsStore();
let cleanupPubSub: ReturnType<typeof initPubSub> | undefined = undefined;

function showMainWindow() {
	logger.info("Showing main window", {
		devUrl: import.meta.env.MAIN_VITE_REMOTE_DEV_URL,
		prodUrl: import.meta.env.MAIN_VITE_REMOTE_PROD_URL,
	});

	const mainWindow = createMainWindow({ isE2E });

	mainWindow.on("ready-to-show", () => {
		cleanupPubSub = initPubSub(mainWindow, { systemStatsStore });
		mainWindow.show();
	});
}

app.on("activate", () => {
	logger.info("App activated");

	if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("web-contents-created", (_, contents) => {
	restrictNavigation(contents);
});

app.on("window-all-closed", () => {
	logger.info("All app windows closed");

	if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
	logger.info("App quitting");
	systemStatsStore.stopSampling();
	cleanupPubSub?.();
});

void app.whenReady().then(() => {
	logger.info("App ready");
	protocol.handle(appProtocol.scheme, appProtocolHandler);
	registerIpcHandlers({ appStore, systemStatsStore });
	systemStatsStore.startSampling();
	showMainWindow();
});
