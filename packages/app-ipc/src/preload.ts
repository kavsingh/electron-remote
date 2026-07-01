// oxlint-disable typescript/no-unsafe-type-assertion

import { keysof } from "@app/shared/common/object";

import { prefixChannel } from "./lib.ts";
import { eventMap, invokeMap } from "./schema.ts";

import type { EventSubscriber, EventSubscriptionMap, IpcApi } from "./lib.ts";
import type { InvokeMap } from "./schema.ts";
import type { IpcRenderer } from "electron";

function createIpcBridge(ipcRenderer: IpcRenderer): IpcApi {
	const invoke = {} as InvokeMap;
	const events = {} as EventSubscriptionMap;

	for (const channel of keysof(invokeMap)) {
		invoke[channel] = ipcRenderer.invoke.bind(
			ipcRenderer,
			prefixChannel(channel),
		);
	}

	for (const channel of keysof(eventMap)) {
		const prefixedChannel = prefixChannel(channel);

		events[channel] = {
			// oxlint-disable-next-line typescript/no-explicit-any
			subscribe: (subscriber: EventSubscriber<any>) => {
				ipcRenderer.addListener(prefixedChannel, subscriber);

				return {
					unsubscribe: () => {
						ipcRenderer.removeListener(prefixedChannel, subscriber);
					},
				};
			},
		};
	}

	return { invoke, events };
}

export { IPC_NAMESPACE } from "./lib.ts";
export { createIpcBridge };
export type * from "./lib.ts";
