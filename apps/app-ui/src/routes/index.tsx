import { createFileRoute } from "@tanstack/react-router";
import { Page } from "design-system/layouts";

import { DeploymentInfoCard } from "./-index/deployment-info-card";
import { SystemInfoCard } from "./-index/system-info-card";
import { SystemStatsCard } from "./-index/system-stats-card";

function Index() {
	return (
		<>
			<Page.Header>Home</Page.Header>
			<Page.Content>
				<div className="space-y-6">
					<DeploymentInfoCard />
					<SystemInfoCard />
					<SystemStatsCard />
				</div>
			</Page.Content>
		</>
	);
}

export const Route = createFileRoute("/")({ component: Index });
