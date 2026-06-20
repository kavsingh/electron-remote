import { EventMap, InvokeMap } from "./ipc-schema.ts";

import type { IpcRendererEvent } from "electron";

type EventSubscriber<TChannel extends keyof EventMap> = (
	event: IpcRendererEvent,
	...payload: EventMap[TChannel]
) => void;

interface EventSubscription {
	unsubscribe: () => void;
}

interface EventSubscribable<TChannel extends keyof EventMap> {
	subscribe: (subscriber: EventSubscriber<TChannel>) => EventSubscription;
}

type EventSubscriptionMap = {
	[TChannel in keyof EventMap]: EventSubscribable<TChannel>;
};

const IPC_NAMESPACE = "__APP_IPC_NAMESPACE__";

interface IpcBridge {
	invoke: InvokeMap;
	events: EventSubscriptionMap;
}

export { IPC_NAMESPACE };
export type {
	IpcBridge,
	EventSubscriber,
	EventSubscription,
	EventSubscribable,
	EventSubscriptionMap,
};
