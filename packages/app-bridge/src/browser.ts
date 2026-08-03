import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/message-port";

import { BRIDGE_STATICS_NAMESPACE } from "./lib.ts";

import type { contract } from "./rpc.ts";
import type { StaticApi } from "./static.ts";
import type {
	ContractRouterClient,
	InferContractRouterOutputs,
	InferContractRouterInputs,
} from "@orpc/contract";

interface BridgeApi extends StaticApi {
	rpc: ContractRouterClient<typeof contract>;
}

function initBridge(): BridgeApi {
	// @ts-expect-error - avoid polluting the global namespace with the Bridge API
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const statics = globalThis[BRIDGE_STATICS_NAMESPACE] as StaticApi | undefined;

	if (!statics) throw new Error("Bridge API is not available");

	const { port1: clientPort, port2: serverPort } = new MessageChannel();

	window.postMessage("start-orpc-client", "*", [serverPort]);

	const link = new RPCLink({ port: clientPort });

	clientPort.start();

	return { ...statics, rpc: createORPCClient(link) };
}

const getBridge: () => BridgeApi = (() => {
	let bridgeApi: BridgeApi | undefined;

	return () => {
		bridgeApi ??= initBridge();

		return bridgeApi;
	};
})();

type RpcInputs = InferContractRouterInputs<typeof contract>;
type RpcOutputs = InferContractRouterOutputs<typeof contract>;

export { getBridge };
export type { BridgeApi, RpcInputs, RpcOutputs };
export type * from "./lib.ts";
export type * from "./static.ts";
