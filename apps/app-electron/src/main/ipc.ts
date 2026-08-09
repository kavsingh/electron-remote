import { typeIpcMain } from "@app/bridge/electron";
import { BrowserWindow, ipcMain, nativeTheme } from "electron";

import { openDialog } from "./services/dialog.ts";
import { getSystemInfo } from "./services/system.ts";

import type { AppStore } from "./stores/app.ts";
import type { SystemStatsStore } from "./stores/system-stats.ts";
import type { ResultAsync } from "neverthrow";

const { registerHandlers, send } = typeIpcMain(ipcMain);

// normalize neverthrow ResultAsync to Promise for ipc contract
// neverthrow classes need to be serialized to be sent over ipc, maybe later
async function fromResultAsync<T, E>(result: ResultAsync<T, E>): Promise<T> {
	return (await result).match(
		(value) => Promise.resolve(value),
		// oxlint-disable-next-line eslint-js/prefer-promise-reject-errors
		(cause) => Promise.reject(cause),
	);
}

function registerIpcHandlers(ctx: {
	appStore: AppStore;
	systemStatsStore: SystemStatsStore;
}) {
	const removeHandlers = registerHandlers({
		getSystemInfo: () => fromResultAsync(getSystemInfo()),
		getSystemStats: () => ctx.systemStatsStore.getState().stats,
		getThemeSource: () => nativeTheme.themeSource,
		setThemeSource: (_, input) => void (nativeTheme.themeSource = input),
		openDialog: (_, input) => fromResultAsync(openDialog(input)),
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
