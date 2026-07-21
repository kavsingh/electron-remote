import { tryOr } from "@app/shared/common/error";
import { formatMem } from "@app/shared/common/format";
import { Card, InfoList } from "design-system/components";

import { ChronoGraph } from "~/components/chrono-graph";
import { ipcApi } from "~/rtk/services/ipc";

import type { SystemStats } from "@app/shared/common/system";

function MemoryGraph(props: { systemStats: SystemStats | undefined }) {
	const memUsed = props.systemStats?.memUsed;
	const memTotal = props.systemStats?.memTotal;

	const sample = memUsed
		? { value: tryOr(() => BigInt(memUsed), 0n) }
		: undefined;

	const maxValue = memTotal ? tryOr(() => BigInt(memTotal), 0n) : 0n;

	return (
		<ChronoGraph
			sampleSource={sample}
			minValue={0n}
			maxValue={maxValue}
			className="rounded-lg block-24 inline-full"
		/>
	);
}

export function SystemStatsCard() {
	const { data: stats } = ipcApi.useSystemStatsQuery();

	return (
		<Card.Root>
			<Card.Header>
				<Card.Title>System stats</Card.Title>
			</Card.Header>
			<Card.Content>
				<div className="grid grid-cols-[1fr_26ch] gap-4">
					<MemoryGraph systemStats={stats} />
					{stats ? (
						<InfoList.Root>
							<InfoList.Entry>
								<InfoList.Label>total memory</InfoList.Label>
								<InfoList.Value>{formatMem(stats.memTotal)}</InfoList.Value>
							</InfoList.Entry>
							<InfoList.Entry>
								<InfoList.Label>used memory</InfoList.Label>
								<InfoList.Value>{formatMem(stats.memUsed)}</InfoList.Value>
							</InfoList.Entry>
						</InfoList.Root>
					) : (
						<>loading...</>
					)}
				</div>
			</Card.Content>
		</Card.Root>
	);
}
