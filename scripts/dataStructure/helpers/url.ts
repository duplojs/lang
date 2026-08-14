import type * as DString from "@scripts/string";
import { UrlConstraint } from "../constraint";

export function url(params?: DString.IsUrlParams) {
	return UrlConstraint(params);
}
