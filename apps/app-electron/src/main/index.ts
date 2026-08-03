import { initializeRpc } from "@app/bridge/electron";
import { onError } from "@orpc/server";
import { RPCHandler } from "@orpc/server/message-port";
import { CORSPlugin } from "@orpc/server/plugins";
import { ipcMain, app, BrowserWindow, protocol } from "electron";
import logger from "electron-log";

import { createMainWindow } from "./app-windows/main-window.ts";
import { appProtocolHandler, appProtocol } from "./lib/app-protocol.ts";
import { initLogging } from "./lib/init-logging.ts";
import { restrictNavigation } from "./lib/restrict-navigation.ts";
import { initRouter } from "./rpc.ts";
import { createAppStore } from "./stores/app.ts";
import { createSystemStatsStore } from "./stores/system-stats.ts";

const isE2E = process.argv.slice(2).includes("--e2e");

app.enableSandbox();
protocol.registerSchemesAsPrivileged([appProtocol]);
initLogging();

const appStore = createAppStore();
const systemStatsStore = createSystemStatsStore();

function showMainWindow() {
	logger.info("Showing main window", import.meta.env);

	const mainWindow = createMainWindow({ isE2E });

	mainWindow.on("ready-to-show", () => {
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
});

void app.whenReady().then(() => {
	logger.info("App ready");
	protocol.handle(appProtocol.scheme, appProtocolHandler);

	const router = initRouter({ appStore, systemStatsStore });
	const rpcHandler = new RPCHandler(router, {
		plugins: [new CORSPlugin()],
		interceptors: [onError((error) => logger.error("RPC error", error))],
	});

	initializeRpc(ipcMain, rpcHandler);

	systemStatsStore.startSampling();
	showMainWindow();
});
