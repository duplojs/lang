import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, type FlowControllerExit, type FlowController, flowControllerExitKind } from "../base";

export const flowControllerFilterKind = createKind("flow-controller-filter");

export interface FlowControllerFilter<
	GenericInput extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends DCommon.UnionToIntersection<
	& FlowController<
		GenericInput,
		GenericOutput extends DEither.Left
			? FlowControllerExit<GenericOutput>
			: GenericOutput extends DEither.Right
				? DEither.GetValue<GenericOutput>
				: GenericOutput
	>
	& DKind.Kind<typeof flowControllerFilterKind>
	> {

}

export const filter = createFlowController(
	flowControllerFilterKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown,
		GenericOutput extends unknown,
	>(
		filterFunction: (
			input: GenericInput,
		) => GenericOutput,
	): FlowControllerFilter<
		GenericInput,
		GenericOutput
	> => init<FlowControllerFilter>(
		(
			previousFunction,
		) => DCommon.callThen(
			previousFunction(),
			(result) => {
				if (flowControllerExitKind.has(result)) {
					return result;
				}

				const filterResult = DEither.unwrapRight(filterFunction(result as never));

				if (DEither.isLeft(filterResult)) {
					return exitFlow(filterResult);
				}

				return filterResult;
			},
		),
	) as never,
);
