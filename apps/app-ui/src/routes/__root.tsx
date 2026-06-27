import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, Link, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";
import { Button } from "design-system/components";
import { usePrefersDark } from "design-system/hooks";
import { useEffect } from "react";

import { ipcApi } from "~/rtk/services/ipc";

import type { ComponentProps } from "react";

function NavLink({
	children,
	...props
}: Omit<ComponentProps<typeof Link>, "className">) {
	return (
		<Link
			{...props}
			className="text-muted-foreground transition-colors hover:underline aria-[current=page]:text-foreground aria-[current=page]:hover:no-underline"
		>
			{children}
		</Link>
	);
}

function RootLayout() {
	const prefersDark = usePrefersDark();
	const [setAppContext] = ipcApi.useSetAppContextMutation();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", prefersDark);
	}, [prefersDark]);

	return (
		<>
			<div className="grid grid-cols-[max-content_1fr] block-full inline-full">
				<div className="bg-linear-to-l from-background p-4 pe-8 pbs-10 text-sm min-block-full">
					<nav className="flex flex-col gap-2">
						<NavLink href="/">Home</NavLink>
						<NavLink href="/files">Files</NavLink>
						<NavLink href="/settings">Settings</NavLink>
					</nav>
					<Button
						size="sm"
						className="mbs-4"
						onClick={() => void setAppContext("loading")}
					>
						Unload
					</Button>
				</div>
				<div className="overflow-x-hidden overflow-y-auto bg-background block-full">
					<Outlet />
					<TanStackDevtools
						plugins={[
							{
								name: "TanStack Router",
								render: <TanStackRouterDevtoolsPanel />,
								defaultOpen: false,
							},
						]}
					/>
				</div>
			</div>
			<div className="fixed inset-x-0 inset-bs-0 z-10 [-webkit-app-region:drag] block-8" />
		</>
	);
}

export const Route = createRootRoute({ component: RootLayout });
