import type { EventMap, InvokeMap } from "./schema.ts";

type EventSubscriber<TChannel extends keyof EventMap> = (
	payload: EventMap[TChannel],
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

type Invoker<TReturn = void, TInput = void, _TProx = TInput> = (
	// oxlint-disable-next-line typescript/no-invalid-void-type
	...args: TInput extends void | undefined ? [] : [input: _TProx]
) => Promise<TReturn>;

export { IPC_NAMESPACE, prefixChannel };
export type {
	Invoker,
	IpcApi,
	EventSubscriber,
	EventSubscription,
	EventSubscribable,
	EventSubscriptionMap,
};
