import { DPath, type ExpectType } from "@scripts";

describe("resolveFrom", () => {
	it("resolves path segments from an absolute origin", () => {
		const origin = "/root" as string;
		const firstSegment = "alpha" as string;
		const secondSegment = "beta" as string;

		if (
			DPath.isAbsolute(origin)
			&& DPath.is(firstSegment)
			&& DPath.is(secondSegment)
		) {
			const result = DPath.resolveFrom(origin, [firstSegment, secondSegment]);

			expect(result).toBe("/root/alpha/beta");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path & DPath.Absolute,
				"strict"
			>;
		}
	});

	it("returns an absolute path when an absolute segment overrides previous parts", () => {
		const origin = "/gamma" as string;
		const firstSegment = "alpha" as string;
		const secondSegment = "/root" as string;
		const thirdSegment = "beta" as string;

		expect(DPath.isAbsolute(origin)).toBe(true);
		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(secondSegment)).toBe(true);
		expect(DPath.is(thirdSegment)).toBe(true);

		if (
			DPath.isAbsolute(origin)
			&& DPath.is(firstSegment)
			&& DPath.is(secondSegment)
			&& DPath.is(thirdSegment)
		) {
			expect(DPath.resolveFrom(origin, [
				firstSegment,
				secondSegment,
				thirdSegment,
			])).toStrictEqual("/root/beta");
		}
	});

	it("resolves parent traversals from an absolute origin", () => {
		const origin = "/root/current" as string;
		const backSegment = ".." as string;
		const targetSegment = "target" as string;

		expect(DPath.isAbsolute(origin)).toBe(true);
		expect(DPath.is(backSegment)).toBe(true);
		expect(DPath.is(targetSegment)).toBe(true);

		if (
			DPath.isAbsolute(origin)
			&& DPath.is(backSegment)
			&& DPath.is(targetSegment)
		) {
			const result = DPath.resolveFrom(origin, [
				backSegment,
				backSegment,
				targetSegment,
			]);

			expect(result).toStrictEqual("/target");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path & DPath.Absolute,
				"strict"
			>;
		}
	});

	it("keeps a result above root inside the absolute root", () => {
		const origin = "/" as string;
		const backSegment = ".." as string;
		const targetSegment = "target" as string;

		expect(DPath.isAbsolute(origin)).toBe(true);
		expect(DPath.is(backSegment)).toBe(true);
		expect(DPath.is(targetSegment)).toBe(true);

		if (
			DPath.isAbsolute(origin)
			&& DPath.is(backSegment)
			&& DPath.is(targetSegment)
		) {
			expect(DPath.resolveFrom(origin, [backSegment, targetSegment]))
				.toStrictEqual("/target");
			expect(DPath.resolveFrom(origin, [backSegment]))
				.toStrictEqual("/");
		}
	});

	it("does not accept stayInOrigin params anymore", () => {
		const origin = "/root/current" as string;
		const segment = "target" as string;

		if (DPath.isAbsolute(origin) && DPath.is(segment)) {
			// @ts-expect-error resolveFrom does not expose a nullable stayInOrigin mode.
			expect(DPath.resolveFrom(origin, [segment], { stayInOrigin: true }))
				.toStrictEqual("/root/current/target");
		}
	});
});
