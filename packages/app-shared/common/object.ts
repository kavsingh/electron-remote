function keysof<T extends object>(obj: T): Array<keyof T> {
	// oxlint-disable-next-line typescript/no-unsafe-type-assertion
	return Object.keys(obj) as Array<keyof T>;
}

export { keysof };
