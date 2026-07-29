import type { Split } from "./split";

export type Length<
	GenericString extends string,
> = Split<GenericString, "">["length"];
