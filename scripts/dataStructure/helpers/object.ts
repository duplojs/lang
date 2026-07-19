import { ObjectStructure, type ShapeObjectStructure } from "../structure";

export function object<
	GenericShape extends ShapeObjectStructure,
>(
	shape: GenericShape,
) {
	return ObjectStructure(
		shape,
	);
}
