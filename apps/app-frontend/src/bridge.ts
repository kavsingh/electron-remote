import { getBridge } from "@app/bridge/browser";

import type { RpcInputs, RpcOutputs } from "@app/bridge/browser";

const { appInfo, rpc } = getBridge();

export { appInfo, rpc };
export type { RpcInputs, RpcOutputs };
