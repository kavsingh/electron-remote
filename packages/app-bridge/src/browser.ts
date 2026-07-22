import { BRIDGE_NAMESPACE } from "./lib.ts";

import type { BridgeApi } from "./lib.ts";

function getBridge(): BridgeApi {
	// @ts-expect-error - avoid polluting the global namespace with the Bridge API
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const bridgeApi = globalThis[BRIDGE_NAMESPACE] as BridgeApi | undefined;

	if (!bridgeApi) throw new Error("Bridge API is not available");

	return bridgeApi;
}

export { getBridge };
export type * from "./lib.ts";
export type * from "./schema.ts";
