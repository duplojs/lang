import { DCommon, type ExpectType } from "@scripts";

describe("sleep", () => {
	it("resolves after the requested delay", async() => {
		vi.useFakeTimers();

		const result = DCommon.sleep(100);
		let resolved = false;

		void result.then(() => {
			resolved = true;
		});

		await vi.advanceTimersByTimeAsync(99);
		expect(resolved).toBe(false);

		await vi.advanceTimersByTimeAsync(1);
		await expect(result).resolves.toBeUndefined();
		expect(resolved).toBe(true);

		type _CheckResult = ExpectType<
			typeof result,
			Promise<void>,
			"strict"
		>;

		vi.useRealTimers();
	});

	it("accepts an omitted delay", async() => {
		vi.useFakeTimers();

		const result = DCommon.sleep();

		await vi.runAllTimersAsync();
		await expect(result).resolves.toBeUndefined();

		vi.useRealTimers();
	});
});
