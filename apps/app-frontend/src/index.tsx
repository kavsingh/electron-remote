import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider as StoreProvider } from "react-redux";

import "./index.css";
import { routeTree } from "./route-tree.gen";
import { createAppStore } from "./rtk/store";

function createTanstackRouter() {
	return createRouter({ routeTree });
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createTanstackRouter>;
	}
}

const appRoot = document.getElementById("app-root");

// makes sense to throw here, since app cannot function without root element
// oxlint-disable-next-line eslint-js/no-restricted-syntax
if (!appRoot) throw new Error("#app-root not found");

const { store } = createAppStore();
const root = createRoot(appRoot);
const router = createTanstackRouter();

root.render(
	<StrictMode>
		<StoreProvider store={store}>
			<RouterProvider router={router} />
		</StoreProvider>
	</StrictMode>,
);
