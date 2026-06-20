// oxlint-disable typescript/no-unsafe-type-assertion

import { eventMap, invokeMap } from "#common/ipc-schema.ts";
import { keysof } from "#common/object.ts";

import type {
	EventSubscriber,
	EventSubscriptionMap,
	IpcBridge,
} from "#common/ipc.ts";
import type { InvokeMap } from "./ipc-schema.ts";
import type { IpcRenderer } from "electron";

function createIpcBridge(ipcRenderer: IpcRenderer): IpcBridge {
	const invoke = {} as InvokeMap;
	const events = {} as EventSubscriptionMap;

	for (const channel of keysof(invokeMap)) {
		invoke[channel] = ipcRenderer.invoke.bind(ipcRenderer, channel);
	}

	for (const channel of keysof(eventMap)) {
		events[channel] = {
			// oxlint-disable-next-line typescript/no-explicit-any
			subscribe: (subscriber: EventSubscriber<any>) => {
				ipcRenderer.addListener(channel, subscriber);

				return {
					unsubscribe: () => {
						ipcRenderer.removeListener(channel, subscriber);
					},
				};
			},
		};
	}

	return { invoke, events };
}

export { IPC_NAMESPACE } from "./ipc.ts";
export { createIpcBridge };
