// https://ui.shadcn.com/docs/components/card

import { twMerge } from "tailwind-merge";

import type { ComponentPropsWithRef } from "react";

export function CardRoot({
	className,
	...props
}: ComponentPropsWithRef<"div">) {
	return (
		<div
			{...props}
			className={twMerge(
				"rounded-xl border border-border bg-card text-card-foreground shadow-sm",
				className,
			)}
		/>
	);
}

//

export function CardHeader({
	className,
	...props
}: ComponentPropsWithRef<"div">) {
	return (
		<div
			{...props}
			className={twMerge("flex flex-col space-y-1.5 p-6", className)}
		/>
	);
}

//

export function CardTitle({
	className,
	...props
}: ComponentPropsWithRef<"h3">) {
	return (
		// oxlint-disable-next-line jsx-a11y/heading-has-content
		<h3
			{...props}
			className={twMerge(
				"leading-none font-semibold tracking-tight",
				className,
			)}
		/>
	);
}

//

export function CardDescription({
	className,
	...props
}: ComponentPropsWithRef<"p">) {
	return (
		<p
			{...props}
			className={twMerge("text-sm text-muted-foreground", className)}
		/>
	);
}

//

export function CardContent({
	className,
	...props
}: ComponentPropsWithRef<"div">) {
	return <div {...props} className={twMerge("p-6 pbs-0", className)} />;
}

//

export function CardFooter({
	className,
	...props
}: ComponentPropsWithRef<"div">) {
	return (
		<div
			{...props}
			className={twMerge("flex items-center p-6 pbs-0", className)}
		/>
	);
}

//

export const Card = {
	Root: CardRoot,
	Header: CardHeader,
	Title: CardTitle,
	Description: CardDescription,
	Content: CardContent,
	Footer: CardFooter,
};
