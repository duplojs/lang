/* oxlint-disable id-length */
import * as DKind from "@scripts/kind";
import * as DString from "@scripts/string";
import { createKind } from "./kind";

export class InvalidMillisecondInStringError extends DKind.parentClass(
	createKind("invalid-millisecond-in-string-error"),
	Error,
) {
	public constructor(
		public input: string,
	) {
		super(undefined, `Invalid Input: ${input}`);
	}
}

const unitMapper = {
	ms: 1,
	s: 1000,
	m: 60_000,
	h: 3_600_000,
	d: 86_400_000,
	w: 604_800_000,
};

const parseRegExp = /(?<rawValue>[0-9.]+)(?<unit>ms|s|m|h|d|w)/;

export type MillisecondInString =
	| `${number}${keyof typeof unitMapper}`
	| `${number}.${number}${keyof typeof unitMapper}`;

export function stringToMillisecond(
	input: MillisecondInString | number,
	...additionalInputs: (MillisecondInString | number)[]
): number;

export function stringToMillisecond(
	input: MillisecondInString | number,
	...additionalInputs: (MillisecondInString | number)[]
): number {
	if (typeof input === "number") {
		return input;
	}

	const result = parseRegExp.exec(input);

	const { rawValue, unit } = result?.groups ?? {};
	const value = parseFloat(rawValue ?? "");

	if (Number.isNaN(value) || !unit || !DString.isKeyof(unit, unitMapper)) {
		throw new InvalidMillisecondInStringError(input);
	}

	const millisecond = Math.floor(value * unitMapper[unit]);

	const [additionalInput, ...restAdditionalInputs] = additionalInputs;

	if (additionalInput) {
		return millisecond + stringToMillisecond(additionalInput, ...restAdditionalInputs);
	}

	return millisecond;
}
