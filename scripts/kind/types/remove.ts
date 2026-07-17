import { type KeySymbol, type Kind } from "../base";

export type Remove<
	GenericObject extends Kind<any>,
> = Omit<GenericObject, KeySymbol>;
