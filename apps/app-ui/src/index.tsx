import { QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { routeTree } from "./route-tree.gen";
import { createQueryClient } from "./services/ipc";

function createTanstackRouter() {
	return createRouter({ routeTree });
}

declare module "@tanstack/react-router" {
	interface Register {
		router: ReturnType<typeof createTanstackRouter>;
	}
}

const appRoot = document.getElementById("app-root");

if (!appRoot) throw new Error("#app-root not found");

const root = createRoot(appRoot);
const client = createQueryClient();
const router = createTanstackRouter();

root.render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
