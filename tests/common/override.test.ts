import { DCommon } from "@scripts";

interface Service {
	value: number;
	getValue(): number;
	increment(delta: number): number;
	superValue: string;
}

describe("createOverride", () => {
	it("overrides methods and default properties", () => {
		const handler = DCommon.createOverride<Service>("service.override.test");
		const base = { superValue: "base" } as Service;
		const result = handler.apply(handler.apply(base));

		handler.setPropertyDefaultValue("value", 10);
		handler.setMethod("getValue", (self) => self.value * 2);
		handler.setMethod("increment", (self, delta) => self.value + delta + 1);

		expect(result.superValue).toBe("base");
		expect("getValue" in result).toBe(true);
		expect(result.value).toBe(10);
		expect(result.getValue()).toBe(20);
		expect(result.increment(5)).toBe(16);
		expect("value" in result).toBe(true);
		expect("increment" in result).toBe(true);
		expect("missing" in result).toBe(false);
		expect(Reflect.get(result, "missing")).toBeUndefined();
		expect({ ...result }).toStrictEqual({
			getValue: expect.any(Function),
			increment: expect.any(Function),
			superValue: "base",
			value: 10,
		});
	});
});
