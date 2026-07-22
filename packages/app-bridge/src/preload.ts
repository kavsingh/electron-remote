// oxlint-disable typescript/no-unsafe-type-assertion

import { keysof } from "@app/shared/common/object";

import { prefixChannel, BRIDGE_NAMESPACE } from "./lib.ts";
import { eventMap, invokeMap } from "./schema.ts";

import type {
	BridgeApi,
	EventSubscriber,
	EventSubscriptionMap,
	IpcApi,
} from "./lib.ts";
import type { InvokeMap, StaticApi } from "./schema.ts";
import type { IpcRenderer } from "electron";

function createIpc(ipcRenderer: IpcRenderer): IpcApi {
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

function createBridge(
	staticApi: StaticApi,
	ipcRenderer: IpcRenderer,
): {
	api: BridgeApi;
	namespace: typeof BRIDGE_NAMESPACE;
} {
	return {
		api: { ...staticApi, ipc: createIpc(ipcRenderer) },
		namespace: BRIDGE_NAMESPACE,
	};
}

export { createBridge };
export type * from "./lib.ts";
