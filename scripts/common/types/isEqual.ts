export type IsEqual<
	GenericLeft extends unknown,
	GenericRight extends unknown,
> = (<GenericValue>() => GenericValue extends GenericLeft ? 1 : 2) extends (
	<GenericValue>() => GenericValue extends GenericRight ? 1 : 2
)
	? true
	: false;
