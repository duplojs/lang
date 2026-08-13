import { sleep } from "./sleep";

interface CreateAsyncRetryOptions {
	maxRetry: number;
	timeToSleep?: number;
	log?: boolean;
}

export function useAsyncRetry<
	GenericOutput extends unknown,
>(
	retryFunction: () => Promise<GenericOutput>,
	shouldRetry: (result: GenericOutput) => boolean,
	options: CreateAsyncRetryOptions,
): Promise<GenericOutput>;

export async function useAsyncRetry<
	GenericOutput extends unknown,
>(
	retryFunction: () => Promise<GenericOutput>,
	shouldRetry: (result: GenericOutput) => boolean,
	options: CreateAsyncRetryOptions,
): Promise<GenericOutput> {
	for (let currentTry = 1; true; currentTry++) {
		const result = await retryFunction();

		if (
			currentTry >= options.maxRetry
			|| !shouldRetry(result)
		) {
			return result;
		}

		if (options.log) {
			console.log(`useAsyncRetry: attempt ${currentTry} failed, starting new attempt.`);
		}

		if (options.timeToSleep) {
			await sleep(options.timeToSleep);
		}
	}
}

export function createAsyncRetry<
	GenericRetryFunction extends (...args: any[]) => Promise<any>,
>(
	retryFunction: GenericRetryFunction,
	checkFunction: (result: Awaited<ReturnType<GenericRetryFunction>>) => boolean,
	options: CreateAsyncRetryOptions,
): GenericRetryFunction;

export function createAsyncRetry(
	retryFunction: (...args: any[]) => Promise<unknown>,
	checkFunction: (result: unknown) => boolean,
	options: CreateAsyncRetryOptions,
) {
	const safeRetryFunction = retryFunction as (...args: unknown[]) => Promise<unknown>;

	return (
		(...args: unknown[]) => useAsyncRetry(
			() => safeRetryFunction(...args),
			checkFunction,
			options,
		)
	);
}
