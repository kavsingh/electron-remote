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

interface IpcApi {
	invoke: InvokeMap;
	events: EventSubscriptionMap;
}

const IPC_NAMESPACE = "__APP_IPC_API__";
const IPC_PREFIX = "__APP_IPC__";

function prefixChannel<const TChannel extends string>(
	channel: TChannel,
): `${typeof IPC_PREFIX}/${TChannel}` {
	return `${IPC_PREFIX}/${channel}`;
}

export { IPC_NAMESPACE, prefixChannel };
export type {
	IpcApi,
	EventSubscriber,
	EventSubscription,
	EventSubscribable,
	EventSubscriptionMap,
};
