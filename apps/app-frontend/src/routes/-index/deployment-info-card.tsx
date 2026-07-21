import { Card, InfoList } from "design-system/components";

export function DeploymentInfoCard() {
	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>Deployment info</Card.Title>
			</Card.Header>
			<Card.Content>
				<InfoList.Root>
					<InfoList.Entry>
						<InfoList.Label>origin</InfoList.Label>
						<InfoList.Value>
							<span className="font-mono text-sm">
								{window.location.origin}
							</span>
						</InfoList.Value>
					</InfoList.Entry>
				</InfoList.Root>
			</Card.Content>
		</Card.Root>
	);
}
