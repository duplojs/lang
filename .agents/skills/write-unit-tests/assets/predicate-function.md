```ts
import { DNamespace, type ExpectType, pipe } from "@scripts";

describe("functionName", () => {
	it("narrows the direct input", () => {
		const input = value as Input;

		if (DNamespace.functionName(input, predicate)) {
			type _CheckInput = ExpectType<
				typeof input,
				NarrowedInput,
				"strict"
			>;
		}
	});

	it("returns the expected runtime result", () => {
		expect(
			DNamespace.functionName(input, predicate),
		).toBe(expectedResult);
	});

	it("preserves narrowing in a pipe", () => {
		const result = pipe(
			input,
			DNamespace.functionName(predicate),
		);

		type _CheckResult = ExpectType<
			typeof result,
			ExpectedResult,
			"strict"
		>;

		expect(result).toStrictEqual(expectedResult);
	});
});
```