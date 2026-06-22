import type { PropsWithChildren } from "react";

function PageHeader(props: PropsWithChildren) {
	return (
		<header className="sticky inset-bs-0 bg-background/50 p-4 pbs-8 backdrop-blur-md">
			<h2 className="text-3xl leading-none font-semibold">{props.children}</h2>
		</header>
	);
}

function PageContent(props: PropsWithChildren) {
	return <main className="p-4">{props.children}</main>;
}

const Page = { Header: PageHeader, Content: PageContent };

export { Page, PageHeader, PageContent };
