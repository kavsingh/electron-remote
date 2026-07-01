import type { EventMap, InvokeMap } from "./schema.ts";
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

// oxlint-disable typescript/no-unnecessary-type-parameters typescript/no-explicit-any typescript/no-unsafe-type-assertion typescript/no-invalid-void-type
const invoker = <TReturn = void, TInput = void, _TProx = TInput>() => {
	return {} as (
		...args: TInput extends void | undefined ? [] : [input: _TProx]
	) => Promise<TReturn>;
};

const eventPayload = <TPayload extends any[] = []>() => ({}) as TPayload;
// oxlint-enable typescript/no-unnecessary-type-parameters typescript/no-explicit-any typescript/no-unsafe-type-assertion typescript/no-invalid-void-type

export { IPC_NAMESPACE, prefixChannel, invoker, eventPayload };
export type {
	IpcApi,
	EventSubscriber,
	EventSubscription,
	EventSubscribable,
	EventSubscriptionMap,
};
