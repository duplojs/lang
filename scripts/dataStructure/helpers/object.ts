import { createStructure } from "../structure";
import { ObjectType, type ShapeObjectType } from "../type";

export function object<
	GenericShape extends ShapeObjectType,
>(
	shape: GenericShape,
) {
	return createStructure(
		ObjectType(shape),
	);
}
