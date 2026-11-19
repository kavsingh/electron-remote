import { prefixChannel } from "./lib.ts";
import { invokeMap, eventMap } from "./schema.ts";

import type {
	InvokeMap,
	InvokeChannel,
	InvokeArgs,
	EventChannel,
	EventPayload,
	SupportedIpc,
} from "./schema.ts";
import type { BrowserWindow, IpcMain } from "electron";

type InvokeReturn<TChannel extends InvokeChannel> = Awaited<
	ReturnType<InvokeMap[TChannel]>
>;

type MainHandlers = {
	[TChannel in InvokeChannel]: (
		event: Electron.IpcMainInvokeEvent,
		...args: InvokeArgs<TChannel>
	) => InvokeReturn<TChannel> | Promise<InvokeReturn<TChannel>>;
};

type UnregisterHandlers = () => void;

interface RegisterHandlersResult {
	unregister: UnregisterHandlers;
}

interface TypedIpcMain {
	supportedIpc: SupportedIpc;
	registerHandlers: (handlers: MainHandlers) => RegisterHandlersResult;
	send: <TChannel extends EventChannel>(
		win: BrowserWindow,
		channel: TChannel,
		payload: EventPayload<TChannel>,
	) => void;
}

function typeIpcMain(ipcMain: IpcMain): TypedIpcMain {
	return {
		supportedIpc: {
			invoke: Object.keys(invokeMap),
			events: Object.keys(eventMap),
		},
		registerHandlers: (handlers) => {
			for (const [channel, handler] of Object.entries(handlers)) {
				ipcMain.handle(prefixChannel(channel), handler);
			}

			return {
				unregister: () => {
					for (const channel of Object.keys(handlers)) {
						ipcMain.removeHandler(prefixChannel(channel));
					}
				},
			};
		},

		send: (win, channel, payload) => {
			if (win.isDestroyed()) return;

			win.webContents.send(prefixChannel(channel), payload);
		},
	};
}

export { typeIpcMain };
export type { AppInfo, InvokeChannel } from "./schema.ts";
export type {
	MainHandlers,
	SupportedIpc,
	TypedIpcMain,
	RegisterHandlersResult,
	UnregisterHandlers,
};
