import { cast, type DString } from "@scripts";

describe("cast", () => {
	it("", () => {
		const value1: string & DString.MaxCharacters<10> = cast("test");

		const value2: string & DString.MinCharacters<10> = cast("test");
	});
});
