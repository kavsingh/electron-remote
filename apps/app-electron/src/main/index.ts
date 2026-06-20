import { app, BrowserWindow, protocol } from "electron";
import log from "electron-log";

import { createMainWindow } from "./app-windows/main-window.ts";
import { initPubSub, registerIpcHandlers } from "./ipc.ts";
import { appProtocolHandler, appProtocol } from "./lib/app-protocol.ts";
import { initLogging } from "./lib/init-logging.ts";
import { restrictNavigation } from "./lib/restrict-navigation.ts";
import { createAppEventBus } from "./services/app-event-bus.ts";
import { startSystemStatsUpdates } from "./services/system-stats.ts";

const isE2E = process.argv.slice(2).includes("--e2e");

app.enableSandbox();
protocol.registerSchemesAsPrivileged([appProtocol]);
initLogging();

const appEventBus = createAppEventBus();
let stopSystemStatsUpdates:
	| ReturnType<typeof startSystemStatsUpdates>
	| undefined = undefined;
let cleanupPubSub: ReturnType<typeof initPubSub> | undefined = undefined;

function showMainWindow() {
	log.info("Showing main window");

	const mainWindow = createMainWindow(isE2E);

	mainWindow.on("ready-to-show", () => {
		cleanupPubSub = initPubSub(mainWindow, appEventBus);
		mainWindow.show();
	});
}

app.on("activate", () => {
	log.info("App activated", {
		devUrl: import.meta.env.MAIN_VITE_REMOTE_DEV_URL,
		prodUrl: import.meta.env.MAIN_VITE_REMOTE_PROD_URL,
	});

	if (BrowserWindow.getAllWindows().length === 0) showMainWindow();
});

app.on("web-contents-created", (_, contents) => {
	restrictNavigation(contents);
});

app.on("window-all-closed", () => {
	log.info("All app windows closed");

	if (process.platform !== "darwin") app.quit();
});

app.on("quit", () => {
	log.info("App quitting");

	cleanupPubSub?.();
	stopSystemStatsUpdates?.();
});

void app.whenReady().then(() => {
	log.info("App ready");
	protocol.handle(appProtocol.scheme, appProtocolHandler);
	registerIpcHandlers();
	stopSystemStatsUpdates = startSystemStatsUpdates(appEventBus);
	showMainWindow();
});
