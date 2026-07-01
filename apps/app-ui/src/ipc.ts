import { getIpc } from "@app/ipc/browser";

const { events, invoke } = getIpc();

export { events, invoke };
export type { InvokeChannel, InvokeArgs, InvokeReturn } from "@app/ipc/schema";
