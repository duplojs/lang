import { DPath, pipe, type ExpectType } from "@scripts";

describe("computeRelative", () => {
	it("returns dot when source and destination are the same safe absolute path", () => {
		const source = "/project/src" as string;
		const destination = "/project/src" as string;

		if (DPath.isAbsolute(source) && DPath.isAbsolute(destination)) {
			const result = DPath.computeRelative(source, destination);

			expect(result).toBe(".");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path,
				"strict"
			>;
		}
	});

	it("computes relative paths for child, parent, and sibling destinations", () => {
		const source = "/project/src" as string;
		const childDestination = "/project/src/components/button" as string;
		const componentSource = "/project/src/components" as string;
		const siblingDestination = "/project/src/assets/icon.svg" as string;
		const domainSource = "/project/src/domain/user" as string;
		const externalDestination = "/project/test/domain/user" as string;

		expect(DPath.isAbsolute(source)).toBe(true);
		expect(DPath.isAbsolute(childDestination)).toBe(true);
		expect(DPath.isAbsolute(componentSource)).toBe(true);
		expect(DPath.isAbsolute(siblingDestination)).toBe(true);
		expect(DPath.isAbsolute(domainSource)).toBe(true);
		expect(DPath.isAbsolute(externalDestination)).toBe(true);

		if (
			DPath.isAbsolute(source)
			&& DPath.isAbsolute(childDestination)
			&& DPath.isAbsolute(componentSource)
			&& DPath.isAbsolute(siblingDestination)
			&& DPath.isAbsolute(domainSource)
			&& DPath.isAbsolute(externalDestination)
		) {
			expect(DPath.computeRelative(source, childDestination))
				.toBe("components/button");

			expect(DPath.computeRelative(componentSource, siblingDestination))
				.toBe("../assets/icon.svg");

			expect(DPath.computeRelative(domainSource, externalDestination))
				.toBe("../../../test/domain/user");
		}
	});

	it("normalizes trailing separators before computing the relative path", () => {
		const source = "/project/src/" as string;
		const destination = "/project/src/components/" as string;

		expect(DPath.isAbsolute(source)).toBe(true);
		expect(DPath.isAbsolute(destination)).toBe(true);

		if (DPath.isAbsolute(source) && DPath.isAbsolute(destination)) {
			expect(DPath.computeRelative(source, destination))
				.toBe("components");
		}
	});

	it("normalizes root paths", () => {
		const root = "/" as string;
		const destination = "/project/src" as string;

		expect(DPath.isAbsolute(root)).toBe(true);
		expect(DPath.isAbsolute(destination)).toBe(true);

		if (DPath.isAbsolute(root) && DPath.isAbsolute(destination)) {
			expect(DPath.computeRelative(root, destination))
				.toBe("project/src");
		}
	});

	it("can be used in a pipe", () => {
		const source = "/project/src/components" as string;
		const destination = "/project/src/assets" as string;

		expect(DPath.isAbsolute(source)).toBe(true);
		expect(DPath.isAbsolute(destination)).toBe(true);

		if (DPath.isAbsolute(source) && DPath.isAbsolute(destination)) {
			const result = pipe(
				source,
				(value) => DPath.computeRelative(value, destination),
			);

			expect(result).toBe("../assets");

			type _CheckResult = ExpectType<
				typeof result,
				string & DPath.Path,
				"strict"
			>;
		}
	});

	it("requires absolute path constraints", () => {
		// @ts-expect-error source must be validated as an absolute path.
		DPath.computeRelative("project/src", "/project/src/components");
		// @ts-expect-error destination must be validated as an absolute path.
		DPath.computeRelative("/project/src", "project/src/components");
	});
});
