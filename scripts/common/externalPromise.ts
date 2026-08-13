type ExternalPromisePossibleValue<
	GenericPromiseValue extends unknown,
> = Awaited<GenericPromiseValue>
	| GenericPromiseValue
	| Promise<GenericPromiseValue>;

export function createExternalPromise<
	GenericPromiseValue extends unknown,
>(): {
	resolve(
		value: ExternalPromisePossibleValue<GenericPromiseValue>,
	): void;
	reject(value: unknown): void;
	promise: Promise<Awaited<GenericPromiseValue>>;
};

export function createExternalPromise() {
	let resolve = undefined as unknown as (value: unknown) => void;
	let reject = undefined as unknown as (value: unknown) => void;
	const promise = new Promise((resolvePromise, rejectPromise) => {
		resolve = resolvePromise;
		reject = rejectPromise;
	});

	return {
		resolve,
		reject,
		promise,
	};
}
