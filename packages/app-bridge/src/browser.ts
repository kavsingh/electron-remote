import { ResultAsync } from "neverthrow";

import { BRIDGE_NAMESPACE } from "./lib.ts";

import type { BridgeApi } from "./lib.ts";
import type { InvokeArgs, InvokeChannel } from "./schema.ts";

type BridgeApiWithNeverthrow = Omit<BridgeApi, "ipc"> & {
	ipc: {
		events: BridgeApi["ipc"]["events"];
		invoke: {
			[TKey in keyof BridgeApi["ipc"]["invoke"]]: (
				...args: Parameters<BridgeApi["ipc"]["invoke"][TKey]>
			) => ResultAsync<
				Awaited<ReturnType<BridgeApi["ipc"]["invoke"][TKey]>>,
				Error
			>;
		};
	};
};

function withNeverthrow(api: BridgeApi): BridgeApiWithNeverthrow {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const wrappedInvoke = {} as BridgeApiWithNeverthrow["ipc"]["invoke"];

	for (const [key, fn] of Object.entries(api.ipc.invoke)) {
		// @ts-expect-error - we know that the keys and types match up
		wrappedInvoke[key] = (...args: unknown[]) => {
			// @ts-expect-error - we know that the keys and types match up
			return ResultAsync.fromPromise(fn(...args), (err) => {
				if (err instanceof Error) return err;
				return new Error(String(err));
			});
		};
	}

	return {
		...api,
		ipc: { ...api.ipc, invoke: wrappedInvoke },
	};
}

function getBridge(): BridgeApiWithNeverthrow {
	// @ts-expect-error - avoid polluting the global namespace with the Bridge API
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const bridgeApi = globalThis[BRIDGE_NAMESPACE] as BridgeApi | undefined;

	// App should fail fast if the bridge API is not available, as it indicates
	// that the app is not running in the expected environment.
	// oxlint-disable-next-line eslint-js/no-restricted-syntax
	if (!bridgeApi) throw new Error("Bridge API is not available");

	return withNeverthrow(bridgeApi);
}

type Invoke = BridgeApiWithNeverthrow["ipc"]["invoke"];
type InvokeReturn<TChannel extends InvokeChannel> = Awaited<
	ReturnType<Invoke[TChannel]>
>;

export { getBridge };
export type {
	BridgeApiWithNeverthrow,
	Invoke,
	InvokeArgs,
	InvokeChannel,
	InvokeReturn,
};
export type * from "./lib.ts";
export type * from "./schema.ts";
