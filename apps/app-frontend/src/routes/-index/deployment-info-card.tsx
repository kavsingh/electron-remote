import { Card } from "design-system/components";

import { appInfo } from "~/bridge";

import type { ReactNode } from "react";

function JSONDump({ title, data }: { title: ReactNode; data: unknown }) {
	return (
		<div>
			<h4 className="mbe-1 text-sm font-semibold">{title}</h4>
			<pre className="overflow-scroll text-xs text-muted-foreground">
				{JSON.stringify(data, null, 2)}
			</pre>
		</div>
	);
}

export function DeploymentInfoCard() {
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Deployment info</Card.Title>
			</Card.Header>
			<Card.Content>
				<div className="grid grid-cols-2 gap-1">
					<JSONDump title="Location" data={window.location} />
					<JSONDump title="App" data={appInfo} />
				</div>
			</Card.Content>
		</Card.Root>
	);
}
