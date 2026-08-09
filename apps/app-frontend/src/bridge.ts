import { getBridge } from "@app/bridge/browser";

const { appInfo, ipc } = getBridge();

const { events, invoke } = ipc;

export { appInfo, events, invoke };
export type {
	Invoke,
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
} from "@app/bridge/browser";
