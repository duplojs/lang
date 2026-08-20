import type * as DCommon from "@scripts/common";
import { type Kind, type Handler } from "./base";
import { type GetHandler } from "./types";

export function createKindIdentifier<
	GenericParent extends Kind<Handler>,
	GenericChildren extends GenericParent,
>() {
	type KindHandlers = GenericChildren extends infer InferredChildren
		? InferredChildren extends GenericParent
			? GetHandler<InferredChildren>
			: never
		: never;

	function identifier<
		GenericKindHandler extends KindHandlers,
		GenericInput extends unknown,
		GenericGroupedKind extends DCommon.Forward<
			GenericKindHandler extends Handler
				? Kind<GenericKindHandler>
				: never
		>,
	>(
		kind: GenericKindHandler | GenericKindHandler[],
	): (
		input: GenericInput,
	) =>
		input is (
			| (
				GenericInput extends GenericParent
					? GenericChildren extends GenericInput
						? GenericChildren extends GenericGroupedKind
							? GenericChildren
							: never
						: never
					: never
			)
			| Extract<
				GenericInput,
				GenericGroupedKind
			>
		);

	function identifier<
		GenericKindHandler extends KindHandlers,
		GenericInput extends unknown,
		GenericGroupedKind extends DCommon.Forward<
			GenericKindHandler extends Handler
				? Kind<GenericKindHandler>
				: never
		>,
	>(
		input: GenericInput,
		kind: GenericKindHandler | GenericKindHandler[],
	):
		input is (
			| (
				GenericInput extends GenericParent
					? GenericChildren extends GenericInput
						? GenericChildren extends GenericGroupedKind
							? GenericChildren
							: never
						: never
					: never
			)
			| Extract<
				GenericInput,
				GenericGroupedKind
			>
		);

	function identifier(
		...args: | [unknown, Handler | Handler[]]
		| [Handler | Handler[]]
	): any {
		if (args.length === 1) {
			const [kind] = args;

			return (input: unknown) => identifier(input as never, kind as never);
		}

		const [input, kind] = args;

		const formattedKind = kind instanceof Array
			? kind
			: [kind];

		for (const kind of formattedKind) {
			if (!kind.has(input)) {
				return false;
			}
		}

		return true;
	}

	return identifier;
}
