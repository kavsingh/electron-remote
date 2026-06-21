import { TanStackDevtools } from "@tanstack/react-devtools";
import { ReactQueryDevtoolsPanel } from "@tanstack/react-query-devtools";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { usePrefersDark } from "design-system/hooks";
import { useEffect } from "react";

function RootLayout() {
	const prefersDark = usePrefersDark();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", prefersDark);
	}, [prefersDark]);

	return (
		<>
			<div className="overflow-x-hidden overflow-y-auto bg-background block-full">
				<Outlet />
				<TanStackDevtools
					plugins={[
						{
							name: "TanStack Query",
							render: <ReactQueryDevtoolsPanel />,
							defaultOpen: true,
						},
						{
							name: "TanStack Router",
							render: <TanStackRouterDevtoolsPanel />,
							defaultOpen: false,
						},
					]}
				/>
			</div>
			<div className="fixed inset-x-0 inset-bs-0 z-10 [-webkit-app-region:drag] block-8" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
