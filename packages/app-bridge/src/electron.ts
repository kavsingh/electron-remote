import { prefixChannel } from "./lib.ts";

import type {
	InvokeMap,
	InvokeChannel,
	InvokeArgs,
	EventChannel,
	EventPayload,
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
	supportedIpcInvoke: InvokeChannel[];
	unregister: UnregisterHandlers;
}

interface TypedIpcMain {
	registerHandlers: (handlers: MainHandlers) => RegisterHandlersResult;
	send: <TChannel extends EventChannel>(
		win: BrowserWindow,
		channel: TChannel,
		payload: EventPayload<TChannel>,
	) => void;
}

function typeIpcMain(ipcMain: IpcMain): TypedIpcMain {
	return {
		registerHandlers: (handlers) => {
			const supportedIpcInvoke: InvokeChannel[] = [];

			for (const [channel, handler] of Object.entries(handlers)) {
				ipcMain.handle(prefixChannel(channel), handler);
				// oxlint-disable-next-line typescript/no-unsafe-type-assertion
				supportedIpcInvoke.push(channel as InvokeChannel);
			}

			return {
				supportedIpcInvoke,
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
	TypedIpcMain,
	RegisterHandlersResult,
	UnregisterHandlers,
};
