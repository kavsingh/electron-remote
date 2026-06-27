import { getIpc } from "app-shared/browser/ipc-browser";

const { events, invoke } = getIpc();

export { events, invoke };
export type {
	InvokeChannel,
	InvokeArgs,
	InvokeReturn,
} from "app-shared/common/ipc-schema";
