import { createFileRoute } from "@tanstack/react-router";

import { Page } from "~/renderer/layouts/page";

function Index() {
	return (
		<>
			<Page.Header>Home</Page.Header>
			<Page.Content>
				<div className="space-y-6">Built-in ui</div>
			</Page.Content>
		</>
	);
}

export const Route = createFileRoute("/")({ component: Index });
