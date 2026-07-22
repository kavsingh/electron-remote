import { getBridge } from "@app/bridge/browser";

const { appInfo, ipc } = getBridge();

const { events, invoke } = ipc;

export { appInfo, events, invoke };
export type {
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
} from "@app/bridge/browser";
