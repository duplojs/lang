import * as DKind from "@scripts/kind";
import * as DCommon from "@scripts/common";
import * as DArray from "@scripts/array";
import * as DObject from "@scripts/object";
import { type Structure, type Structures } from "../structure";
import { type createKind } from "../kind";
import { type Type, type Types } from "../type";
import { type Constraint, type Constraints } from "../constraint";
import { type Error, type DecodeIssue, type EncodeIssue, type Issue, issueKind, encodeIssueKind, decodeIssueKind } from "./error";
import { type Codec } from "./codec";

const kindNamespaceName: DKind.GetNamespaceName<typeof createKind> = "DuplojsLangDataStructure";

type RemoveNamespace<
	GenericString,
> = GenericString extends `@${typeof kindNamespaceName}/${infer InferredKindName}`
	? InferredKindName
	: never;

export interface InterpretedMessage {
	source?: string;
	interpretedSource?: string;
	subSource?: string;
	interpretedSubSource?: string;

}

export interface InterpretedIssue extends Issue {
	interpretedMessage: InterpretedMessage;
}

export interface InterpretedEncodedIssue extends EncodeIssue {
	interpretedMessage: InterpretedMessage;
}

export interface InterpretedDecodedIssue extends DecodeIssue {
	interpretedMessage: InterpretedMessage;
}

export type InterpretedIssues = (
	| InterpretedIssue
	| InterpretedEncodedIssue
	| InterpretedDecodedIssue
);

type CreateDictionaryParams = DCommon.SimplifyTopLevel<
	Omit<
		& {
			[
			DataStructure in (
				| Types
				| Structures
				| Constraints
			) as RemoveNamespace<
				DKind.GetName<DataStructure>
			>
			]?: (structure: DataStructure) => string
		},
		| RemoveNamespace<DKind.GetName<Type>>
		| RemoveNamespace<DKind.GetName<Structure>>
		| RemoveNamespace<DKind.GetName<Constraint>>
	>
>;

export function createErrorInterpreter(
	structureDictionary: CreateDictionaryParams = {},
	codecDictionary: [Codec, string][] = [],
): (error: Error) => readonly InterpretedIssues[] {
	const formattedStructureDictionary = DCommon.pipe(
		structureDictionary,
		DObject.entries,
		DArray.map(
			([key, value]) => DObject.entry(
				`${DKind.keyKindPrefix}@${kindNamespaceName}/${key}`,
				value,
			),
		),
	);
	const getInterpretedMessageStructure = (structure: Structure | Type | Constraint) => DArray.reduce(
		formattedStructureDictionary,
		DArray.reduceFrom(undefined),
		({ element: [key, getMessage], next, exit }) => getMessage && key in structure
			? exit(getMessage(structure as never))
			: next(undefined),
	);
	const getInterpretedMessageCodec = (codec: Codec) => DArray.reduce(
		codecDictionary,
		DArray.reduceFrom(undefined),
		({ element: [currentCodec, message], next, exit }) => currentCodec === codec
			? exit(message)
			: next(undefined),
	);

	return (error) => DArray.map(
		error.issues,
		(issue) => {
			if (issueKind.has(issue)) {
				const source = issue.getSource();
				const subSource = issue.getSubSource?.();

				return ({
					...issue,
					interpretedMessage: {
						source: source.definition.message,
						subSource: subSource?.definition.message,
						interpretedSource: getInterpretedMessageStructure(source),
						interpretedSubSource: subSource && getInterpretedMessageStructure(subSource),
					},
				}) satisfies InterpretedIssue;
			}

			if (encodeIssueKind.has(issue)) {
				return ({
					...issue,
					interpretedMessage: {
						source: issue.message,
						interpretedSource: getInterpretedMessageCodec(issue.getSource()),
					},
				}) satisfies InterpretedEncodedIssue;
			}

			return ({
				...issue,
				interpretedMessage: {
					source: issue.message,
					interpretedSource: getInterpretedMessageCodec(issue.getSource()),
				},
			}) satisfies InterpretedDecodedIssue;
		},
	);
}

export type ErrorInterpreter = ReturnType<typeof createErrorInterpreter>;
