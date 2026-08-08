export type IsExtends<
	GenericValueA extends unknown,
	GenericValueB extends unknown,
> = Extract<GenericValueA, any> extends GenericValueB
	? true
	: false;
