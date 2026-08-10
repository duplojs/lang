export function asyncChunk<
	const GenericItem extends unknown,
>(
	size: number,
): (
	iterator: AsyncIterable<GenericItem>,
) => AsyncGenerator<GenericItem[], unknown, unknown>;

export function asyncChunk<
	const GenericItem extends unknown,
>(
	iterator: AsyncIterable<GenericItem>,
	size: number,
): AsyncGenerator<GenericItem[], unknown, unknown>;

export function asyncChunk(
	...args:
		| [size: number]
		| [iterator: AsyncIterable<unknown>, size: number]
): any {
	if (args.length === 1) {
		const [size] = args;

		return (iterator: AsyncIterable<unknown>) => asyncChunk(iterator, size);
	}

	const [iterator, size] = args;

	return (async function *() {
		let buffer: unknown[] = [];

		for await (const element of iterator) {
			buffer.push(element);

			if (buffer.length === size) {
				yield buffer;
				buffer = [];
			}
		}

		if (buffer.length > 0) {
			yield buffer;
		}
	})();
}
