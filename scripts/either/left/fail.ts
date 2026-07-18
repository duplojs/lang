import type * as DKind from "@scripts/kind";
import { createEitherKind } from "../kind";
import { left, type Left } from "./create";

export const failKind = createEitherKind("fail");

type _Fail = (
	& Left<"fail", void>
	& DKind.Kind<typeof failKind>
);

export interface Fail extends _Fail {

}

/**
 * {@include either/fail/index.md}
 */
export function fail(): Fail;

export function fail() {
	return failKind.setTo(
		left("fail", undefined),
		null,
	);
}
