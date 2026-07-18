import * as DKind from "@scripts/kind";

export const createEitherKind = DKind.createNamespace(
	"DuplojsLangEither",
);

export const informationKind = createEitherKind<
	"information",
	string
>("information");
