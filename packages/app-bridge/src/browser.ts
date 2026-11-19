import { ResultAsync } from "neverthrow";

import { BRIDGE_NAMESPACE } from "./lib.ts";

import type { BridgeApi, EventSubscriptionMap } from "./lib.ts";
import type {
	InvokeArgs,
	InvokeChannel,
	InvokeMap,
	EventChannel,
} from "./schema.ts";

type InvokeWithNeverthrow<TChannel extends InvokeChannel> = (
	...args: InvokeArgs<TChannel>
) => ResultAsync<Awaited<ReturnType<InvokeMap[TChannel]>>, Error>;

type ClientBridgeApi = Omit<BridgeApi, "ipc"> & {
	ipc: {
		supportsInvoke: (channel: InvokeChannel) => boolean;
		supportsEvent: (channel: EventChannel) => boolean;
		invoke: {
			[TKey in InvokeChannel]?: InvokeWithNeverthrow<TKey> | undefined;
		};
		events: {
			[TKey in EventChannel]?: EventSubscriptionMap[TKey] | undefined;
		};
	};
};

function prepareIpc(api: BridgeApi): ClientBridgeApi {
	const supported = api.appInfo.supportedIpc;
	const wrappedInvoke: ClientBridgeApi["ipc"]["invoke"] = {};
	const wrappedEvents: ClientBridgeApi["ipc"]["events"] = {};

	function supportsInvoke(channel: InvokeChannel) {
		return supported.invoke.includes(channel);
	}

	function supportsEvent(channel: EventChannel) {
		return supported.events.includes(channel);
	}

	for (const [key, fn] of Object.entries(api.ipc.invoke)) {
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		const channel = key as InvokeChannel;

		if (!supportsInvoke(channel)) continue;

		// @ts-expect-error - we know that the keys and types match up
		wrappedInvoke[channel] = (...args: unknown[]) => {
			// @ts-expect-error - we know that the keys and types match up
			return ResultAsync.fromPromise(fn(...args), (err) => {
				if (err instanceof Error) return err;
				return new Error(String(err));
			});
		};
	}

	for (const [channel, fn] of Object.entries(api.ipc.events)) {
		// @ts-expect-error - we know that the keys and types match up
		if (supportsEvent(channel)) wrappedEvents[channel] = fn;
	}

	return {
		...api,
		ipc: {
			supportsInvoke,
			supportsEvent,
			invoke: wrappedInvoke,
			events: wrappedEvents,
		},
	};
}

function getBridge(): ClientBridgeApi {
	// @ts-expect-error - avoid polluting the global namespace with the Bridge API
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const bridgeApi = globalThis[BRIDGE_NAMESPACE] as BridgeApi | undefined;

	// App should fail fast if the bridge API is not available, as it indicates
	// that the app is not running in the expected environment.
	// oxlint-disable-next-line eslint-js/no-restricted-syntax
	if (!bridgeApi) throw new Error("Bridge API is not available");

	return prepareIpc(bridgeApi);
}

type Invoke = ClientBridgeApi["ipc"]["invoke"];
type InvokeReturn<TChannel extends InvokeChannel> = Awaited<
	ReturnType<NonNullable<Invoke[TChannel]>>
>;

export { getBridge };
export type {
	ClientBridgeApi,
	Invoke,
	InvokeArgs,
	InvokeChannel,
	InvokeReturn,
};
export type * from "./lib.ts";
export type * from "./schema.ts";
