import { createFileRoute } from "@tanstack/react-router";
import { getIpc } from "app-shared/browser/ipc-browser.ts";
import { Button } from "design-system/components";
import { Page } from "design-system/layouts";

const { invoke } = getIpc();

function Index() {
	return (
		<>
			<Page.Header>Loading</Page.Header>
			<Page.Content>
				<div className="space-y-6">
					<Button onClick={() => void invoke.setAppContext("main")}>
						Load main
					</Button>
				</div>
			</Page.Content>
		</>
	);
}

export const Route = createFileRoute("/")({ component: Index });
