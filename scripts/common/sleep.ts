export function sleep(
	milliseconds?: number,
): Promise<void>;

export function sleep(
	milliseconds?: number,
) {
	return new Promise<void>((resolve) => void setTimeout(resolve, milliseconds));
}
