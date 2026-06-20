import { IPC_NAMESPACE } from "#common/ipc.ts";

import type { IpcApi } from "#common/ipc.ts";

function getIpc(): IpcApi {
	// @ts-expect-error - avoid polluting the global namespace with the IPC API
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	const ipcApi = globalThis[IPC_NAMESPACE] as IpcApi | undefined;

	if (!ipcApi) throw new Error("IPC API is not available");

	return ipcApi;
}

export { getIpc };
export type * from "#common/ipc.ts";
