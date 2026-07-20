import type * as DCommon from "@scripts/common";
import type * as DString from "@scripts/string";
import type * as DTuple from "@scripts/tuple";

// oxlint-disable @stylistic/quote-props
interface FigureGreaterThanTable {
	"0": ["0", "1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"1": ["1", "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"2": ["2", "3" | "4" | "5" | "6" | "7" | "8" | "9"];
	"3": ["3", "4" | "5" | "6" | "7" | "8" | "9"];
	"4": ["4", "5" | "6" | "7" | "8" | "9"];
	"5": ["5", "6" | "7" | "8" | "9"];
	"6": ["6", "7" | "8" | "9"];
	"7": ["7", "8" | "9"];
	"8": ["8", "9"];
	"9": ["9", ""];
}

type FigureGreaterThanTableValue = FigureGreaterThanTable[keyof FigureGreaterThanTable];

type CreateGreaterThanTable<
	GenericSplitReference extends DCommon.AnyTuple<DString.Digit>,
> = GenericSplitReference extends [
	infer InferredFirst extends DString.Digit,
	...infer InferredRest,
]
	? InferredRest extends readonly []
		? [FigureGreaterThanTable[InferredFirst]]
		: CreateGreaterThanTable<
			DCommon.Adaptor<
				InferredRest,
				DCommon.AnyTuple<DString.Digit>
			>
		> extends infer InferredRestResult extends DCommon.AnyTuple<FigureGreaterThanTableValue>
			? [FigureGreaterThanTable[InferredFirst], ...InferredRestResult]
			: never
	: never;

type CheckIsGreater<
	GreaterSplitValue extends DCommon.AnyTuple<DString.Digit>,
	GreaterTableReference extends DCommon.AnyTuple<FigureGreaterThanTableValue>,
> = GreaterSplitValue[0] extends GreaterTableReference[0][1]
	? true
	: DCommon.IsEqual<GreaterSplitValue[0], GreaterTableReference[0][0]> extends true
		? DCommon.IsEqual<GreaterSplitValue["length"], 1> extends true
			? false
			: [
				DTuple.Shift<GreaterSplitValue>,
				DTuple.Shift<GreaterTableReference>,
			] extends [
				infer InferredRestSplitValue extends DCommon.AnyTuple<DString.Digit>,
				infer InferredRestSplitReference extends DCommon.AnyTuple<FigureGreaterThanTableValue>,
			]
				? CheckIsGreater<InferredRestSplitValue, InferredRestSplitReference>
				: never
		: false;

type toStringDecimal<
	GenericValue extends number,
> = `${GenericValue}` extends `${DString.Number}.${DString.Number}`
	? `${GenericValue}`
	: `${GenericValue}.0`;

type PrepareValues<
	GenericValue extends number,
	GenericReference extends number,
> = [
	toStringDecimal<GenericValue>,
	toStringDecimal<GenericReference>,
] extends [
	`${infer InferredValueInteger extends DString.Number}.${infer InferredValueDecimals extends DString.Number}`,
	`${infer InferredReferenceInteger extends DString.Number}.${infer InferredReferenceDecimals extends DString.Number}`,
]
	? DCommon.And<[
		DCommon.IsEqual<InferredValueDecimals, "0">,
		DCommon.IsEqual<InferredReferenceDecimals, "0">,
	]> extends true
		? [InferredValueInteger, InferredReferenceInteger]
		: DCommon.IsEqual<
			InferredValueInteger,
			InferredReferenceInteger
		> extends true
			? [
				DString.Split<InferredValueDecimals, "">,
				DString.Split<InferredReferenceDecimals, "">,
			] extends [
				infer InferredSplitValue extends DCommon.AnyTuple<DString.Digit>,
				infer InferredSplitReference extends DCommon.AnyTuple<DString.Digit>,
			]
				? (
					DCommon.IsEqual<InferredSplitValue["length"], InferredSplitReference["length"]> extends true
						? [
							DTuple.Join<InferredSplitValue, "">,
							DTuple.Join<InferredSplitReference, "">,
						]
						: (
							DTuple.Create<any, InferredSplitValue["length"]> extends [...DTuple.Create<any, InferredSplitReference["length"]>, ...any[]]
								? InferredSplitValue["length"]
								: InferredSplitReference["length"]
						) extends infer InferredLength extends number
							? [
								DTuple.Join<
									Extract<
										DCommon.IsEqual<InferredLength, InferredSplitValue["length"]> extends true
											? InferredSplitValue
											: DTuple.Create<"0", InferredLength, InferredSplitValue>,
										DCommon.AnyTuple<string>
									>,
									""
								>,
								DTuple.Join<
									Extract<
										DCommon.IsEqual<InferredLength, InferredSplitReference["length"]> extends true
											? InferredSplitReference
											: DTuple.Create<"0", InferredLength, InferredSplitReference>,
										DCommon.AnyTuple<string>
									>,
									""
								>,
							]
							: never
				) extends [
					`${infer InferredResultValue}`,
					`${infer InferredResultReference}`,
				]
					? [`${InferredResultValue}`, `${InferredResultReference}`]
					: never
				: never
			: [InferredValueInteger, InferredReferenceInteger]
	: never;

type ComputeIsGreater<
	GenericValue extends number,
	GenericReference extends number,
> = PrepareValues<
	GenericValue,
	GenericReference
> extends [
	infer InferredValue extends DString.Number,
	infer InferredReference extends DString.Number,
]
	? DCommon.And<[
		DString.Includes<InferredValue, "-">,
		DCommon.Not<DString.Includes<InferredReference, "-">>,
	]> extends true
		? false
		: DCommon.And<[
			DCommon.Not<DString.Includes<InferredValue, "-">>,
			DString.Includes<InferredReference, "-">,
		]> extends true
			? true
			: (
				[
					DString.Split<DString.Replace<InferredValue, "-", "">, "">,
					DString.Split<DString.Replace<InferredReference, "-", "">, "">,
				] extends [
					infer InferredSplitValue extends DCommon.AnyTuple<DString.Digit>,
					infer InferredSplitReference extends DCommon.AnyTuple<DString.Digit>,
				]
					? DCommon.IsEqual<InferredSplitValue["length"], InferredSplitReference["length"]> extends true
						? CheckIsGreater<
							InferredSplitValue,
							CreateGreaterThanTable<InferredSplitReference>
						>
						: DTuple.Create<0, InferredSplitValue["length"]> extends [
							...DTuple.Create<0, InferredSplitReference["length"]>,
							...0[],
						]
							? true
							: false
					: never
			) extends infer InferredResult extends boolean
				? DString.Includes<InferredValue, "-"> extends true
					? DCommon.Not<InferredResult>
					: InferredResult
				: never
	: never;

export type IsGreaterOrEqual<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.Or<[
	DCommon.IsEqual<GenericValue, GenericReference>,
	ComputeIsGreater<GenericValue, GenericReference>,
]>;

export type IsGreater<
	GenericValue extends number,
	GenericReference extends number,
> = DCommon.And<[
	DCommon.Not<DCommon.IsEqual<GenericValue, GenericReference>>,
	ComputeIsGreater<GenericValue, GenericReference>,
]>;
