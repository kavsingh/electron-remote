import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import { routeTree } from "./route-tree.gen";

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

const client = new QueryClient();
const router = createTanstackRouter();
const root = createRoot(appRoot);

root.render(
	<StrictMode>
		<QueryClientProvider client={client}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</StrictMode>,
);
