import { getBridge } from "@app/bridge/browser";

const { appInfo, ipc } = getBridge();

const { events, invoke, supportsInvoke, supportsEvent } = ipc;

export { appInfo, events, invoke, supportsInvoke, supportsEvent };
export type {
	Invoke,
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
} from "@app/bridge/browser";
