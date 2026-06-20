import { useQuery } from "@tanstack/react-query";
import { Card, InfoList } from "design-system/components";

import { systemInfoQuery } from "~/services/ipc";

export function SystemInfoCard() {
	const { data: info } = useQuery(systemInfoQuery());

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System info</Card.Title>
			</Card.Header>
			<Card.Content>
				{info ? (
					<InfoList.Root>
						<InfoList.Entry>
							<InfoList.Label>os</InfoList.Label>
							<InfoList.Value>
								{info.osName} {info.osVersion}
							</InfoList.Value>
						</InfoList.Entry>
						<InfoList.Entry>
							<InfoList.Label>arch</InfoList.Label>
							<InfoList.Value>{info.osArch}</InfoList.Value>
						</InfoList.Entry>
					</InfoList.Root>
				) : (
					<>loading...</>
				)}
			</Card.Content>
		</Card.Root>
	);
}
