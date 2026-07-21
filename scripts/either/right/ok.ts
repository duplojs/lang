import type * as DKind from "@scripts/kind";
import { createKind } from "../kind";
import { right, type Right } from "./create";

export const okKind = createKind("ok");

type _Ok = (
	& Right<"ok", void>
	& DKind.Kind<typeof okKind>
);

export interface Ok extends _Ok {

}

export function ok(): Ok;

export function ok() {
	return okKind.setTo(
		right("ok", undefined),
		null,
	);
}
