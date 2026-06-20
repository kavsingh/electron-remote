import type { InvokeMap, EventMap } from "#common/ipc-schema.ts";
import type { BrowserWindow, IpcMain } from "electron";

type MainHandlers = {
	[K in keyof InvokeMap]: (
		event: Electron.IpcMainInvokeEvent,
		...args: Parameters<InvokeMap[K]>
	) =>
		| Awaited<ReturnType<InvokeMap[K]>>
		| Promise<Awaited<ReturnType<InvokeMap[K]>>>;
};

interface TypedIpcMain {
	registerHandlers: (handlers: MainHandlers) => () => void;
	send: <TChannel extends keyof EventMap>(
		win: BrowserWindow,
		channel: TChannel,
		...payload: EventMap[TChannel]
	) => void;
}

function typeIpcMain(ipcMain: IpcMain): TypedIpcMain {
	return {
		registerHandlers: (handlers) => {
			for (const [channel, handler] of Object.entries(handlers)) {
				ipcMain.handle(channel, handler);
			}

			return function cleanup() {
				for (const channel of Object.keys(handlers)) {
					ipcMain.removeHandler(channel);
				}
			};
		},

		send: (win, channel, ...payload) => {
			if (!win.isDestroyed()) win.webContents.send(channel, ...payload);
		},
	};
}

export { typeIpcMain };
