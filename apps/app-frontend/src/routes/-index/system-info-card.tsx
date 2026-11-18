import { Card, InfoList } from "design-system/components";

import { ipcApi } from "~/rtk/services/ipc";

function CardContent() {
	const { data } = ipcApi.useSystemInfoQuery();

	if (!data) return <>loading...</>;

	return (
		<InfoList.Root>
			<InfoList.Entry>
				<InfoList.Label>os</InfoList.Label>
				<InfoList.Value>
					{data.osName} {data.osVersion}
				</InfoList.Value>
			</InfoList.Entry>
			<InfoList.Entry>
				<InfoList.Label>arch</InfoList.Label>
				<InfoList.Value>{data.osArch}</InfoList.Value>
			</InfoList.Entry>
		</InfoList.Root>
	);
}

export function SystemInfoCard() {
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System info</Card.Title>
			</Card.Header>
			<Card.Content>
				<CardContent />
			</Card.Content>
		</Card.Root>
	);
}
