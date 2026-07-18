import { StringMinConstraint } from "../constraint";

export function stringMin<
	GenericMin extends number,
>(min: GenericMin) {
	return StringMinConstraint(min);
}
