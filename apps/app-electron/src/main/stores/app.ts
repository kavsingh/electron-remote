import { Store } from "~/lib/store.ts";

import type { AppContext } from "app-shared/common/app.ts";

interface AppState {
	appContext: AppContext;
}

type AppStore = ReturnType<typeof createAppStore>;

function createAppStore() {
	return new Store<AppState>({ appContext: "loading" });
}

export { createAppStore };
export type { AppStore };
