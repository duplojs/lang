import type * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";
import * as DEither from "@scripts/either";
import { createKind } from "../../../kind";
import { createFlowController, flowControllerExitKind, type FlowController } from "../base";

export const flowControllerAborterKind = createKind("flow-controller-aborter");

export interface FlowControllerAborter<
	GenericInput extends unknown = unknown,
	GenericOutput extends unknown = unknown,
> extends DCommon.UnionToIntersection<
	& FlowController<
		GenericInput,
		Promise<
			| Awaited<GenericOutput>
			| DEither.Left<"signal-aborted", AbortErrorFlowController>
		>
	>
	& DKind.Kind<typeof flowControllerAborterKind>
	> {

}

export class AbortErrorFlowController extends DKind.parentClass(
	createKind("abort-error-flow-controller"),
	Error,
) {
	public constructor(
		public abortController: AbortController,
	) {
		super(null, "Flow is aborted by FlowControllerAborter.");
	}
}

export const aborter = createFlowController(
	flowControllerAborterKind,
	({ init, exitFlow }) => <
		GenericInput extends unknown,
		GenericOutput extends unknown,
	>(
		theFunction: (
			input: GenericInput,
			aborter: AbortController,
		) => GenericOutput,
	): FlowControllerAborter<
		GenericInput,
		GenericOutput
	> => {
		let aborter: AbortController | undefined = undefined;

		return init<FlowControllerAborter>(
			async(previousFunction) => {
				const result = previousFunction();
				if (flowControllerExitKind.has(result)) {
					return result;
				}
				aborter?.abort(new AbortErrorFlowController(aborter));
				const currentAborter = new AbortController();
				aborter = currentAborter;

				try {
					const abortResult = await theFunction(result as never, currentAborter);

					if (currentAborter.signal.aborted === true) {
						return exitFlow(
							DEither.left(
								"signal-aborted",
								currentAborter.signal.reason,
							),
						);
					}
					return abortResult;
				} catch (error) {
					if (error instanceof AbortErrorFlowController) {
						return exitFlow(
							DEither.left(
								"signal-aborted",
								currentAborter.signal.reason,
							),
						);
					}

					throw error;
				}
			},
		) as never;
	},
);
