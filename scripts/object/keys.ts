import * as DCommon from "@scripts/common";
import * as DKind from "@scripts/kind";

export function keys<
	GenericObject extends object,
>(object: GenericObject): `${Exclude<keyof GenericObject, symbol>}`[];

export function keys(object: object): string[] {
	const result = [];

	for (const key in object) {
		if (!DCommon.isRuntimeWrappedValueKey(key) && !DKind.isRuntimeKey(key)) {
			result.push(key);
		}
	}

	return result;
}
