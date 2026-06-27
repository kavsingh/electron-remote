import { createFileRoute } from "@tanstack/react-router";
import { Button, Card } from "design-system/components";
import { Page } from "design-system/layouts";
import { useCallback, useEffect, useState } from "react";
import { tv } from "tailwind-variants";

import { useFileDrop } from "~/hooks/files";
import { ipcApi } from "~/rtk/services/ipc";

const emptyFileList: string[] = [];

function DialogFileSelect({
	onSelect,
}: {
	onSelect: (selected: string[]) => void;
}) {
	const [mutate, { data }] = ipcApi.useOpenDialogMutation();
	const filePaths = data?.filePaths ?? emptyFileList;

	useEffect(() => onSelect(filePaths), [filePaths, onSelect]);

	return (
		<Button
			onClick={() => {
				void mutate({ properties: ["openFile", "multiSelections"] });
			}}
		>
			Select files
		</Button>
	);
}

const dragFileSelectVariants = tv({
	base: "my-3 grid place-items-center rounded-md border border-border text-muted-foreground transition-colors block-50",
	variants: {
		isActive: { true: "border-foreground bg-accent/20 text-foreground" },
	},
});

function DragFileSelect({
	onSelect,
}: {
	onSelect: (selected: string[]) => void;
}) {
	const [{ files, isActive }, dragDropHandlers] = useFileDrop();
	const filePaths = files?.map(({ file, isDirectory }) => {
		return `${file.webkitRelativePath} (${isDirectory ? "directory" : "file"})`;
	});

	useEffect(() => {
		onSelect(filePaths ?? emptyFileList);
	}, [filePaths, onSelect]);

	return (
		<div className={dragFileSelectVariants({ isActive })} {...dragDropHandlers}>
			Drop files
		</div>
	);
}

function Files() {
	const [selectedFiles, setSelectedFiles] = useState<string[]>([]);
	const handleFileSelect = useCallback((selected: string[]) => {
		setSelectedFiles((current) => current.concat(selected));
	}, []);

	return (
		<>
			<Page.Header>Files</Page.Header>
			<Page.Content>
				<DialogFileSelect onSelect={handleFileSelect} />
				<DragFileSelect onSelect={handleFileSelect} />
				<Card.Root>
					<Card.Header>
						<Card.Title>Selected files</Card.Title>
					</Card.Header>
					<Card.Content>
						<ul className="flex flex-col gap-1">
							{selectedFiles.map((file) => (
								<li
									key={file}
									className="flex gap-2 border-be border-border pbe-2 text-sm text-muted-foreground last:border-be-0 last:pbe-0"
								>
									{file}
								</li>
							))}
						</ul>
					</Card.Content>
				</Card.Root>
			</Page.Content>
		</>
	);
}

export const Route = createFileRoute("/files")({ component: Files });
