import * as DArray from "@scripts/array";
import * as DString from "@scripts/string";
import { encodeIssueKind } from "./base";
import { codecsJson, codecsString } from "../codec";
import { type CodecDictionaryParams, type StructureDictionaryParams } from "./interpreter";

export const defaultErrorInterpreterDataStructureDictionary = {
	"array-structure": () => "Expected an array.",
	"lazy-structure": () => "Expected a value matching the resolved structure.",
	"non-encodable-string-structure": (source) => `Expected ${DString.stringify(source.definition.value)}.`,
	"object-structure": () => "Expected a plain object containing only the defined properties.",
	"record-structure": () => "Expected a plain object matching the record definition.",
	"type-structure": () => "Expected a value matching the configured type.",
	"union-structure": () => "Expected a value matching at least one union member.",

	"bigint-type": () => "Expected a bigint.",
	"bigint-literal-type": (source) => `Expected ${DString.to(source.definition.value)}n.`,
	"boolean-type": () => "Expected a boolean.",
	"boolean-literal-type": (source) => `Expected ${source.definition.value}.`,
	"date-type": () => "Expected a DuploJS date.",
	"null-type": () => "Expected null.",
	"number-type": () => "Expected a finite number.",
	"number-literal-type": (source) => `Expected ${source.definition.value}.`,
	"string-type": () => "Expected a string.",
	"string-literal-type": (source) => `Expected ${DString.stringify(source.definition.value)}.`,
	"time-type": () => "Expected a DuploJS time.",
	"undefined-type": () => "Expected undefined.",

	"absolute-path-constraint": () => "Expected an absolute path.",
	"allowed-characters-constraint": (source) => `Expected a string containing only characters from ${DString.join(DArray.coalescing(source.definition.charactersRange), ", ")}.`,
	"array-length-equal-constraint": (source) => `Expected an array containing exactly ${source.definition.length} elements.`,
	"between-than-constraint": (source) => `Expected a number greater than ${source.definition.greater} and less than ${source.definition.less}.`,
	"between-than-or-equal-constraint": (source) => `Expected a number greater than or equal to ${source.definition.greater} and less than or equal to ${source.definition.less}.`,
	"email-constraint": () => "Expected a valid email address.",
	"even-constraint": () => "Expected an even number.",
	"greater-than-constraint": (source) => `Expected a number greater than ${source.definition.threshold}.`,
	"greater-than-or-equal-constraint": (source) => `Expected a number greater than or equal to ${source.definition.threshold}.`,
	"integer-constraint": () => "Expected an integer.",
	"less-than-constraint": (source) => `Expected a number less than ${source.definition.threshold}.`,
	"less-than-or-equal-constraint": (source) => `Expected a number less than or equal to ${source.definition.threshold}.`,
	"max-characters-constraint": (source) => `Expected a string containing at most ${source.definition.max} characters.`,
	"max-elements-constraint": (source) => `Expected an array containing at most ${source.definition.max} elements.`,
	"min-characters-constraint": (source) => `Expected a string containing at least ${source.definition.min} characters.`,
	"min-elements-constraint": (source) => `Expected an array containing at least ${source.definition.min} elements.`,
	"multiple-of-constraint": (source) => `Expected a multiple of ${source.definition.multiple}.`,
	"negative-constraint": () => "Expected a number less than or equal to zero.",
	"not-empty-constraint": () => "Expected a non-empty string.",
	"not-zero-constraint": () => "Expected a non-zero number.",
	"number-in-string-constraint": () => "Expected a string representing a number.",
	"odd-constraint": () => "Expected an odd number.",
	"path-constraint": () => "Expected a valid path.",
	"positive-constraint": () => "Expected a number greater than or equal to zero.",
	"refine-constraint": () => "Expected a value satisfying the custom refinement.",
	"regex-constraint": (source) => `Expected a string matching ${source.definition.regex.toString()}.`,
	"safe-constraint": () => "Expected a number strictly between Number.MIN_SAFE_INTEGER and Number.MAX_SAFE_INTEGER.",
	"segment-path-constraint": () => "Expected a valid path segment.",
	"strict-negative-constraint": () => "Expected a number less than zero.",
	"strict-positive-constraint": () => "Expected a number greater than zero.",
	"string-length-equal-constraint": (source) => `Expected a string containing exactly ${source.definition.length} characters.`,
	"trimmed-constraint": () => "Expected a string without leading or trailing whitespace.",
	"url-constraint": () => "Expected a valid URL.",
	"uuid-constraint": () => "Expected a valid UUID.",
} as const satisfies Required<StructureDictionaryParams>;

const createDefaultCodecErrorMessage = (
	codecName: string,
	encodedValueDescription: string,
	decodedValueDescription: string,
): CodecDictionaryParams[number][1] => (
	_codec,
	issue,
) => {
	if (issue.from === "predicate") {
		return encodeIssueKind.has(issue)
			? `The ${codecName} codec must produce ${encodedValueDescription}.`
			: `Expected ${encodedValueDescription} for the ${codecName} codec.`;
	}

	if (issue.from === "encoding") {
		return `The ${codecName} codec could not encode ${decodedValueDescription}.`;
	}

	if (issue.from === "decoding") {
		return `The ${codecName} codec could not decode the value as ${decodedValueDescription}.`;
	}

	return `The ${codecName} codec encountered an external error while ${encodeIssueKind.has(issue) ? "encoding" : "decoding"}.`;
};

export const defaultErrorInterpreterCodecDictionary = [
	[
		codecsJson.definition.bigint,
		createDefaultCodecErrorMessage("JSON bigint", "a string", "a bigint"),
	],
	[
		codecsJson.definition.date,
		createDefaultCodecErrorMessage("JSON date", "a string", "a DuploJS date"),
	],
	[
		codecsJson.definition.time,
		createDefaultCodecErrorMessage("JSON time", "a string", "a DuploJS time"),
	],
	[
		codecsString.definition.bigint,
		createDefaultCodecErrorMessage("string bigint", "a string", "a bigint"),
	],
	[
		codecsString.definition.boolean,
		createDefaultCodecErrorMessage("string boolean", "the string \"true\" or \"false\"", "a boolean"),
	],
	[
		codecsString.definition.date,
		createDefaultCodecErrorMessage("string date", "a string", "a DuploJS date"),
	],
	[
		codecsString.definition.null,
		createDefaultCodecErrorMessage("string null", "the string \"null\"", "null"),
	],
	[
		codecsString.definition.number,
		createDefaultCodecErrorMessage("string number", "a string representing a number", "a finite number"),
	],
	[
		codecsString.definition.time,
		createDefaultCodecErrorMessage("string time", "a string", "a DuploJS time"),
	],
	[
		codecsString.definition.undefined,
		createDefaultCodecErrorMessage("string undefined", "the string \"undefined\"", "undefined"),
	],
] as const satisfies CodecDictionaryParams;
