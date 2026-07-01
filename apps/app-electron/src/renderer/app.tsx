import { getIpc } from "@app/ipc/browser";
import { Button } from "design-system/components";
import { usePrefersDark } from "design-system/hooks";
import { Page } from "design-system/layouts";
import { useEffect } from "react";

const { invoke } = getIpc();

function App() {
	const prefersDark = usePrefersDark();

	useEffect(() => {
		document.documentElement.classList.toggle("dark", prefersDark);
	}, [prefersDark]);

	return (
		<>
			<div className="overflow-x-hidden overflow-y-auto bg-background block-full">
				<Page.Header>Loading</Page.Header>
				<Page.Content>
					<div className="space-y-6">
						<Button onClick={() => void invoke.setAppContext("main")}>
							Load main
						</Button>
					</div>
				</Page.Content>
			</div>
			<div className="fixed inset-x-0 inset-bs-0 z-10 [-webkit-app-region:drag] block-8" />
		</>
	);
}

export { App };
