import { DString, pipe, type ExpectType } from "@scripts";

describe("isKeyof", () => {
	it("should validate a key with a defined value", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};

		expect(DString.isKeyof("name", source)).toBe(true);
		expect(DString.isKeyof("missing", source)).toBe(false);
	});

	it("should consider a key with undefined value as missing", () => {
		const source = {
			name: undefined,
		};

		expect(DString.isKeyof("name", source)).toBe(false);
	});

	it("should validate a key in pipe", () => {
		const result = pipe(
			"name",
			DString.isKeyof({
				name: "Duplo",
			}),
		);

		expect(result).toBe(true);
	});

	it("should narrow the key to object keys when the value is defined", () => {
		const source = {
			name: "Duplo",
			version: 1,
		};
		const key = "name" as "name" | "missing";

		if (DString.isKeyof(key, source)) {
			type _CheckKey = ExpectType<
				typeof key,
				"name",
				"strict"
			>;
		} else {
			type _CheckKey = ExpectType<
				typeof key,
				"missing",
				"strict"
			>;
		}
	});
});
