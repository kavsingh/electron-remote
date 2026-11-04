import { cn } from "#css";

import type { ComponentPropsWithRef } from "react";

function InfoListRoot({ className, ...props }: ComponentPropsWithRef<"ul">) {
	return <ul {...props} className={cn("m-0 list-none p-0", className)} />;
}

function InfoListEntry({ className, ...props }: ComponentPropsWithRef<"li">) {
	return (
		<li
			{...props}
			className={cn(
				"flex gap-2 border-be border-be-border py-2 last:border-be-0",
				className,
			)}
		/>
	);
}

function InfoListLabel({ className, ...props }: ComponentPropsWithRef<"span">) {
	return <span {...props} className={cn("text-muted-foreground", className)} />;
}

function InfoListValue(props: ComponentPropsWithRef<"span">) {
	return <span {...props} />;
}

const InfoList = {
	Root: InfoListRoot,
	Entry: InfoListEntry,
	Label: InfoListLabel,
	Value: InfoListValue,
};

export { InfoList, InfoListRoot, InfoListEntry, InfoListLabel, InfoListValue };
