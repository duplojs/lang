import { DArray, DPath, pipe, type ExpectType } from "@scripts";

describe("resolveRelative", () => {
	it("resolves safe path segments", () => {
		const firstSegment = "alpha" as string;
		const secondSegment = "beta" as string;

		if (DPath.is(firstSegment) && DPath.is(secondSegment)) {
			const result = DPath.resolveRelative([firstSegment, secondSegment]);

			expect(result).toBe("alpha/beta");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path,
				"strict"
			>;
		}
	});

	it("accepts a path segment array with a min elements constraint", () => {
		const segments = ["alpha", "beta"] as (string & DPath.Path)[];

		if (DArray.minElements(segments, 1)) {
			const result = DPath.resolveRelative(segments);

			expect(result).toBe("alpha/beta");

			type _CheckSegments = ExpectType<
				typeof segments,
				(string & DPath.Path)[] & DArray.MinElements<1>,
				"strict"
			>;
			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path,
				"strict"
			>;
		}
	});

	it("trims trailing slashes and leading relative prefixes", () => {
		const firstSegment = "alpha/" as string;
		const secondSegment = "./beta" as string;
		const thirdSegment = "gamma/" as string;

		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(secondSegment)).toBe(true);
		expect(DPath.is(thirdSegment)).toBe(true);

		if (
			DPath.is(firstSegment)
			&& DPath.is(secondSegment)
			&& DPath.is(thirdSegment)
		) {
			expect(DPath.resolveRelative([firstSegment, secondSegment, thirdSegment]))
				.toBe("alpha/beta/gamma");
		}
	});

	it("ignores unsafe empty segments internally", () => {
		// @ts-expect-error empty segments are rejected by the public API.
		expect(DPath.resolveRelative(["alpha/", "", "./beta", "gamma/"]))
			.toBe("alpha/beta/gamma");
	});

	it("resets the path when an absolute segment is encountered", () => {
		const firstSegment = "alpha" as string;
		const secondSegment = "/root" as string;
		const thirdSegment = "beta" as string;

		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(secondSegment)).toBe(true);
		expect(DPath.is(thirdSegment)).toBe(true);

		if (
			DPath.is(firstSegment)
			&& DPath.is(secondSegment)
			&& DPath.is(thirdSegment)
		) {
			expect(DPath.resolveRelative([firstSegment, secondSegment, thirdSegment]))
				.toBe("/root/beta");
		}
	});

	it("resets to root when a root segment is encountered", () => {
		const rootSegment = "/" as string;
		const firstSegment = "alpha" as string;
		const thirdSegment = "beta" as string;

		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(rootSegment)).toBe(true);
		expect(DPath.is(thirdSegment)).toBe(true);

		if (DPath.is(firstSegment) && DPath.is(rootSegment) && DPath.is(thirdSegment)) {
			expect(DPath.resolveRelative([firstSegment, rootSegment, thirdSegment]))
				.toBe("/beta");
		}
	});

	it("preserves leading parent traversal when resolving above root", () => {
		const firstSegment = "alpha" as string;
		const backSegment = ".." as string;
		const lastSegment = "beta" as string;

		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(backSegment)).toBe(true);
		expect(DPath.is(lastSegment)).toBe(true);

		if (
			DPath.is(firstSegment)
			&& DPath.is(backSegment)
			&& DPath.is(lastSegment)
		) {
			const result = DPath.resolveRelative([
				firstSegment,
				backSegment,
				backSegment,
				lastSegment,
			]);

			expect(result).toBe("../beta");
		}
	});

	it("can be used directly in a pipe", () => {
		const firstSegment = "alpha" as string;
		const secondSegment = "beta" as string;

		expect(DPath.is(firstSegment)).toBe(true);
		expect(DPath.is(secondSegment)).toBe(true);

		if (DPath.is(firstSegment) && DPath.is(secondSegment)) {
			const result = pipe(
				[firstSegment, secondSegment] as const,
				DPath.resolveRelative,
			);

			expect(result).toBe("alpha/beta");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path,
				"strict"
			>;
		}
	});
});
