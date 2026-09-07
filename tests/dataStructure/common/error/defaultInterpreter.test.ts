import { DDataStructure, type ExpectType } from "@scripts";

describe("defaultErrorInterpreterDataStructureDictionary", () => {
	it("formats default structure messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["array-structure"](),
			dictionary["lazy-structure"](),
			dictionary["non-encodable-string-structure"](
				DDataStructure.NonEncodableStringStructure("value \"quoted\""),
			),
			dictionary["object-structure"](),
			dictionary["record-structure"](),
			dictionary["type-structure"](),
			dictionary["union-structure"](),
		]).toStrictEqual([
			"Expected an array.",
			"Expected a value matching the resolved structure.",
			"Expected \"value \\\"quoted\\\"\".",
			"Expected a plain object containing only the defined properties.",
			"Expected a plain object matching the record definition.",
			"Expected a value matching the configured type.",
			"Expected a value matching at least one union member.",
		]);
	});

	it("formats default type messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["bigint-type"](),
			dictionary["bigint-literal-type"](
				DDataStructure.BigintLiteralType(12n),
			),
			dictionary["boolean-type"](),
			dictionary["boolean-literal-type"](
				DDataStructure.BooleanLiteralType(true),
			),
			dictionary["date-type"](),
			dictionary["null-type"](),
			dictionary["number-type"](),
			dictionary["number-literal-type"](
				DDataStructure.NumberLiteralType(12.5),
			),
			dictionary["string-type"](),
			dictionary["string-literal-type"](
				DDataStructure.StringLiteralType("value \"quoted\""),
			),
			dictionary["time-type"](),
			dictionary["undefined-type"](),
		]).toStrictEqual([
			"Expected a bigint.",
			"Expected 12n.",
			"Expected a boolean.",
			"Expected true.",
			"Expected a DuploJS date.",
			"Expected null.",
			"Expected a finite number.",
			"Expected 12.5.",
			"Expected a string.",
			"Expected \"value \\\"quoted\\\"\".",
			"Expected a DuploJS time.",
			"Expected undefined.",
		]);
	});

	it("formats default constraint messages", () => {
		const dictionary = DDataStructure.defaultErrorInterpreterDataStructureDictionary;

		expect([
			dictionary["absolute-path-constraint"](),
			dictionary["allowed-characters-constraint"](
				DDataStructure.allowedCharacters(["a-z", "0-9"]),
			),
			dictionary["array-length-equal-constraint"](
				DDataStructure.arrayLengthEqual(3),
			),
			dictionary["between-than-constraint"](
				DDataStructure.betweenThan(1, 5),
			),
			dictionary["between-than-or-equal-constraint"](
				DDataStructure.betweenThanOrEqual(1, 5),
			),
			dictionary["email-constraint"](),
			dictionary["even-constraint"](),
			dictionary["greater-than-constraint"](
				DDataStructure.greaterThan(1),
			),
			dictionary["greater-than-or-equal-constraint"](
				DDataStructure.greaterThanOrEqual(1),
			),
			dictionary["integer-constraint"](),
			dictionary["less-than-constraint"](DDataStructure.lessThan(5)),
			dictionary["less-than-or-equal-constraint"](
				DDataStructure.lessThanOrEqual(5),
			),
			dictionary["max-characters-constraint"](
				DDataStructure.maxCharacters(10),
			),
			dictionary["max-elements-constraint"](
				DDataStructure.maxElements(10),
			),
			dictionary["min-characters-constraint"](
				DDataStructure.minCharacters(3),
			),
			dictionary["min-elements-constraint"](
				DDataStructure.minElements(3),
			),
			dictionary["multiple-of-constraint"](
				DDataStructure.multipleOf(3),
			),
			dictionary["negative-constraint"](),
			dictionary["not-empty-constraint"](),
			dictionary["not-zero-constraint"](),
			dictionary["number-in-string-constraint"](),
			dictionary["odd-constraint"](),
			dictionary["path-constraint"](),
			dictionary["positive-constraint"](),
			dictionary["refine-constraint"](),
			dictionary["regex-constraint"](DDataStructure.regex(/value/u)),
			dictionary["safe-constraint"](),
			dictionary["segment-path-constraint"](),
			dictionary["strict-negative-constraint"](),
			dictionary["strict-positive-constraint"](),
			dictionary["string-length-equal-constraint"](
				DDataStructure.stringLengthEqual(3),
			),
			dictionary["trimmed-constraint"](),
			dictionary["url-constraint"](),
			dictionary["uuid-constraint"](),
		]).toStrictEqual([
			"Expected an absolute path.",
			"Expected a string containing only characters from a-z, 0-9.",
			"Expected an array containing exactly 3 elements.",
			"Expected a number greater than 1 and less than 5.",
			"Expected a number greater than or equal to 1 and less than or equal to 5.",
			"Expected a valid email address.",
			"Expected an even number.",
			"Expected a number greater than 1.",
			"Expected a number greater than or equal to 1.",
			"Expected an integer.",
			"Expected a number less than 5.",
			"Expected a number less than or equal to 5.",
			"Expected a string containing at most 10 characters.",
			"Expected an array containing at most 10 elements.",
			"Expected a string containing at least 3 characters.",
			"Expected an array containing at least 3 elements.",
			"Expected a multiple of 3.",
			"Expected a number less than or equal to zero.",
			"Expected a non-empty string.",
			"Expected a non-zero number.",
			"Expected a string representing a number.",
			"Expected an odd number.",
			"Expected a valid path.",
			"Expected a number greater than or equal to zero.",
			"Expected a value satisfying the custom refinement.",
			"Expected a string matching /value/u.",
			"Expected a number strictly between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER.",
			"Expected a valid path segment.",
			"Expected a number less than zero.",
			"Expected a number greater than zero.",
			"Expected a string containing exactly 3 characters.",
			"Expected a string without leading or trailing whitespace.",
			"Expected a valid URL.",
			"Expected a valid UUID.",
		]);
	});
});

describe("defaultErrorInterpreterCodecDictionary", () => {
	it("formats predicate issues for every default codec", () => {
		const errorHandler = DDataStructure.createErrorHandler();
		const codecs = [
			DDataStructure.codecsJson.definition.bigint,
			DDataStructure.codecsJson.definition.date,
			DDataStructure.codecsJson.definition.time,
			DDataStructure.codecsString.definition.bigint,
			DDataStructure.codecsString.definition.boolean,
			DDataStructure.codecsString.definition.date,
			DDataStructure.codecsString.definition.null,
			DDataStructure.codecsString.definition.number,
			DDataStructure.codecsString.definition.time,
			DDataStructure.codecsString.definition.undefined,
		];

		codecs.forEach(
			(codec) => void errorHandler.addDecodeIssue(codec, "predicate", "invalid"),
		);

		const interpretedIssues = DDataStructure.createErrorInterpreter(
			{},
			DDataStructure.defaultErrorInterpreterCodecDictionary,
		)(errorHandler.createError());

		type _CheckDictionary = ExpectType<
			DDataStructure.CodecDictionaryParams,
			typeof DDataStructure.defaultErrorInterpreterCodecDictionary,
			"two-extends-one"
		>;

		expect(
			interpretedIssues.map(
				(issue) => issue.interpretedMessage.interpretedSource,
			),
		).toStrictEqual([
			"Expected a string for the JSON bigint codec.",
			"Expected a string for the JSON date codec.",
			"Expected a string for the JSON time codec.",
			"Expected a string for the string bigint codec.",
			"Expected the string \"true\" or \"false\" for the string boolean codec.",
			"Expected a string for the string date codec.",
			"Expected the string \"null\" for the string null codec.",
			"Expected a string representing a number for the string number codec.",
			"Expected a string for the string time codec.",
			"Expected the string \"undefined\" for the string undefined codec.",
		]);
	});

	it("adapts messages to every codec issue origin and direction", () => {
		const codec = DDataStructure.codecsJson.definition.bigint;
		const errorHandler = DDataStructure.createErrorHandler();

		errorHandler.addEncodeIssue(codec, "predicate", "invalid");
		errorHandler.addDecodeIssue(codec, "predicate", "invalid");
		errorHandler.addEncodeIssue(codec, "encoding", 12n);
		errorHandler.addDecodeIssue(codec, "decoding", "invalid");
		errorHandler.addEncodeIssue(codec, "external", 12n);
		errorHandler.addDecodeIssue(codec, "external", "invalid");

		const interpretedIssues = DDataStructure.createErrorInterpreter(
			{},
			DDataStructure.defaultErrorInterpreterCodecDictionary,
		)(errorHandler.createError());

		expect(
			interpretedIssues.map(
				(issue) => issue.interpretedMessage.interpretedSource,
			),
		).toStrictEqual([
			"The JSON bigint codec must produce a string.",
			"Expected a string for the JSON bigint codec.",
			"The JSON bigint codec could not encode a bigint.",
			"The JSON bigint codec could not decode the value as a bigint.",
			"The JSON bigint codec encountered an external error while encoding.",
			"The JSON bigint codec encountered an external error while decoding.",
		]);
	});
});
