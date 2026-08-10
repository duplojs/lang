export function chunk<
	const GenericItem extends unknown,
>(
	size: number,
): (
	iterator: Iterable<GenericItem>,
) => Generator<GenericItem[], unknown, unknown>;

export function chunk<
	const GenericItem extends unknown,
>(
	iterator: Iterable<GenericItem>,
	size: number,
): Generator<GenericItem[], unknown, unknown>;

export function chunk(
	...args:
		| [size: number]
		| [iterator: Iterable<unknown>, size: number]
): any {
	if (args.length === 1) {
		const [size] = args;

		return (iterator: Iterable<unknown>) => chunk(iterator, size);
	}

	const [iterator, size] = args;

	return (function *() {
		let buffer: unknown[] = [];

		for (const item of iterator) {
			buffer.push(item);

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
