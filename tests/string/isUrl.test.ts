import { DString, type ExpectType } from "@scripts";

describe("isUrl", () => {
	it("should validate an url", () => {
		expect(DString.isUrl("https://duplojs.dev/lang")).toBe(true);
		expect(DString.isUrl("duplojs.dev/lang")).toBe(false);
	});

	it("should validate url hostname and protocol", () => {
		expect(
			DString.isUrl(
				"https://lang.duplojs.dev",
				{
					hostname: /^lang\.duplojs\.dev$/,
					protocol: /^https$/,
				},
			),
		).toBe(true);

		expect(
			DString.isUrl(
				"http://lang.duplojs.dev",
				{ protocol: /^https$/ },
			),
		).toBe(false);

		expect(
			DString.isUrl(
				"https://api.duplojs.dev",
				{ hostname: /^lang\.duplojs\.dev$/ },
			),
		).toBe(false);
	});

	it("should reset stateful regex params before testing", () => {
		const hostname = /^lang\.duplojs\.dev$/g;
		const protocol = /^https$/g;

		hostname.lastIndex = 4;
		protocol.lastIndex = 3;

		expect(
			DString.isUrl(
				"https://lang.duplojs.dev",
				{
					hostname,
					protocol,
				},
			),
		).toBe(true);
	});

	it("should narrow the string with an url constraint", () => {
		const source = "https://duplojs.dev" as string;

		if (DString.isUrl(source)) {
			type _CheckSource = ExpectType<
				typeof source,
				string & DString.Url,
				"strict"
			>;
		} else {
			type _CheckSource = ExpectType<
				typeof source,
				string,
				"strict"
			>;
		}
	});
});
