import { typeIpcMain } from "app-shared/node/ipc-electron.ts";
import { BrowserWindow, ipcMain, nativeTheme, dialog } from "electron";

import { AppEvent, AppEventBus } from "./services/app-event-bus.ts";
import { getSystemInfo } from "./services/system-info.ts";
import { getSystemStats } from "./services/system-stats.ts";

const { registerHandlers, send } = typeIpcMain(ipcMain);

export function registerIpcHandlers() {
	registerHandlers({
		getSystemInfo,
		getSystemStats,
		getThemeSource: () => nativeTheme.themeSource,
		setThemeSource: (_, input) => {
			nativeTheme.themeSource = input;

			return nativeTheme.themeSource;
		},
		openDialog: (_, input) => {
			// TODO: determine requesting window somehow?
			const focusedWindow = BrowserWindow.getAllWindows().find((win) =>
				win.isFocused(),
			);

			if (!focusedWindow) throw new Error("No focused window");

			return dialog.showOpenDialog(focusedWindow, input);
		},
	});
}

export function initPubSub(win: BrowserWindow, eventBus: AppEventBus) {
	function handleSystemStats(event: AppEvent<"systemStats">) {
		send(win, "systemStats", event);
	}

	eventBus.addListener("systemStats", handleSystemStats);

	return () => {
		eventBus.removeListener("systemStats", handleSystemStats);
	};
}
