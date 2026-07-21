import { prefixChannel } from "./lib.ts";

import type {
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
	EventChannel,
	EventPayload,
} from "./schema.ts";
import type { BrowserWindow, IpcMain } from "electron";

type MainHandlers = {
	[TChannel in InvokeChannel]: (
		event: Electron.IpcMainInvokeEvent,
		...args: InvokeArgs<TChannel>
	) => InvokeReturn<TChannel> | Promise<InvokeReturn<TChannel>>;
};

interface TypedIpcMain {
	registerHandlers: (handlers: MainHandlers) => () => void;
	send: <TChannel extends EventChannel>(
		win: BrowserWindow,
		channel: TChannel,
		payload: EventPayload<TChannel>,
	) => void;
}

function typeIpcMain(ipcMain: IpcMain): TypedIpcMain {
	return {
		registerHandlers: (handlers) => {
			for (const [channel, handler] of Object.entries(handlers)) {
				ipcMain.handle(prefixChannel(channel), handler);
			}

			return function cleanup() {
				for (const channel of Object.keys(handlers)) {
					ipcMain.removeHandler(prefixChannel(channel));
				}
			};
		},

		send: (win, channel, payload) => {
			if (win.isDestroyed()) return;

			win.webContents.send(prefixChannel(channel), payload);
		},
	};
}

export { typeIpcMain };
