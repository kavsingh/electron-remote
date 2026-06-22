// oxlint-disable typescript/no-unnecessary-type-parameters typescript/no-explicit-any typescript/no-unsafe-type-assertion typescript/no-invalid-void-type
const invoker = <TReturn = void, TInput = void, _TProx = TInput>() => {
	return {} as (
		...args: TInput extends void | undefined ? [] : [input: _TProx]
	) => Promise<TReturn>;
};

const eventPayload = <TPayload extends any[] = []>() => ({}) as TPayload;
// oxlint-enable typescript/no-unnecessary-type-parameters typescript/no-explicit-any typescript/no-unsafe-type-assertion typescript/no-invalid-void-type

export { invoker, eventPayload };
