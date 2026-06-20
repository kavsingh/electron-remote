import { IPC_NAMESPACE } from "#common/ipc.ts";

import type { IpcBridge } from "#common/ipc.ts";

function getIpcBridge(): IpcBridge {
	// @ts-expect-error - avoid polluting the global namespace with the IPC bridge
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const ipcBridge = globalThis[IPC_NAMESPACE] as IpcBridge | undefined;

	if (!ipcBridge) throw new Error("IPC bridge is not available");

	return ipcBridge;
}

export { getIpcBridge };
export type * from "#common/ipc.ts";
