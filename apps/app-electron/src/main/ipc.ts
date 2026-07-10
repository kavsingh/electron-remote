import { typeIpcMain } from "@app/ipc/electron";
import { BrowserWindow, ipcMain, nativeTheme } from "electron";

import { openDialog } from "./services/dialog.ts";
import { getSystemInfo } from "./services/system.ts";

import type { AppStore } from "./stores/app.ts";
import type { SystemStatsStore } from "./stores/system-stats.ts";

const { registerHandlers, send } = typeIpcMain(ipcMain);

function registerIpcHandlers(ctx: {
	appStore: AppStore;
	systemStatsStore: SystemStatsStore;
}) {
	const removeHandlers = registerHandlers({
		getSystemInfo,
		getSystemStats: () => ctx.systemStatsStore.getState().stats,
		getThemeSource: () => nativeTheme.themeSource,
		setThemeSource: (_, input) => void (nativeTheme.themeSource = input),
		openDialog: (_, input) => openDialog(input),
		getAppContext: () => ctx.appStore.getState().appContext,
		setAppContext: (_, input) => {
			ctx.appStore.update((state) => void (state.appContext = input));
		},
	});

	return removeHandlers;
}

function initPubSub(
	win: BrowserWindow,
	ctx: { systemStatsStore: SystemStatsStore },
) {
	function handleStatsUpdate() {
		send(win, "systemStats", ctx.systemStatsStore.getState().stats);
	}

	ctx.systemStatsStore.addListener("update", handleStatsUpdate);

	return () => {
		ctx.systemStatsStore.removeListener("update", handleStatsUpdate);
	};
}

export { registerIpcHandlers, initPubSub };
