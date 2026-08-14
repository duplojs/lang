import { type Constraint } from "../base";
import type * as DDefaults from "../defaults";

export interface ConstraintsStore {
	allowedCharacters: DDefaults.AllowedCharactersConstraint;
	arrayLengthEqual: DDefaults.ArrayLengthEqualConstraint;
	betweenThan: DDefaults.BetweenThanConstraint;
	betweenThanOrEqual: DDefaults.BetweenThanOrEqualConstraint;
	email: DDefaults.EmailConstraint;
	even: DDefaults.EvenConstraint;
	greaterThan: DDefaults.GreaterThanConstraint;
	greaterThanOrEqual: DDefaults.GreaterThanOrEqualConstraint;
	integer: DDefaults.IntegerConstraint;
	lessThan: DDefaults.LessThanConstraint;
	lessThanOrEqual: DDefaults.LessThanOrEqualConstraint;
	maxCharacters: DDefaults.MaxCharactersConstraint;
	maxElements: DDefaults.MaxElementsConstraint;
	minElements: DDefaults.MinElementsConstraint;
	multipleOf: DDefaults.MultipleOfConstraint;
	negative: DDefaults.NegativeConstraint;
	notEmpty: DDefaults.NotEmptyConstraint;
	notZero: DDefaults.NotZeroConstraint;
	odd: DDefaults.OddConstraint;
	positive: DDefaults.PositiveConstraint;
	safe: DDefaults.SafeConstraint;
	strictNegative: DDefaults.StrictNegativeConstraint;
	strictPositive: DDefaults.StrictPositiveConstraint;
	stringLengthEqual: DDefaults.StringLengthEqualConstraint;
	stringMin: DDefaults.MinCharactersConstraint;
	url: DDefaults.UrlConstraint;
	uuid: DDefaults.UuidConstraint;
}

export type Constraints = Extract<
	ConstraintsStore[keyof ConstraintsStore],
	Constraint
>;
