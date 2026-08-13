import * as DCommon from "@scripts/common";
import type * as DKind from "@scripts/kind";
import * as DObject from "../object";
import * as DArray from "../array";
import * as DString from "../string";
import { type PortHandler } from "./port";
import { createKind } from "./kind";

export type UseCaseDependencies = Record<
	string,
	UseCaseHandler | PortHandler
>;

export type UseCaseDependenciesValue<
	GenericDependencies extends UseCaseDependencies,
> = DCommon.SimplifyTopLevel<{
	[
	Prop in keyof GenericDependencies as Uncapitalize<Extract<Prop, string>>
	]: GenericDependencies[Prop] extends PortHandler
		? ReturnType<GenericDependencies[Prop]["createImplementation"]>
		: GenericDependencies[Prop] extends UseCaseHandler
			? ReturnType<GenericDependencies[Prop]["getUseCase"]>
			: never
}>;

export type GetAllPorts<
	GenericDependenciesValue extends UseCaseDependencies,
> = GenericDependenciesValue extends any
	? ({
		[Prop in keyof GenericDependenciesValue]: (
			GenericDependenciesValue[Prop] extends PortHandler
				? [
					Uncapitalize<Extract<Prop, string>>,
					ReturnType<
						GenericDependenciesValue[Prop]["createImplementation"]
					>,
				]
				: GenericDependenciesValue[Prop] extends UseCaseHandler
					? GetAllPorts<GenericDependenciesValue[Prop]["dependencies"]>
					: never
		)
	})[keyof GenericDependenciesValue]
	: never;

export const useCaseHandlerKind = createKind("use-case-handler");

export interface UseCaseHandler<
	GenericDependencies extends UseCaseDependencies = any,
	GenericUseCase extends(input: any) => any = any,
> extends DKind.Kind<typeof useCaseHandlerKind> {
	dependencies: GenericDependencies;

	getUseCase(
		ports: DCommon.SimplifyTopLevel<
			& (
				GetAllPorts<
					GenericDependencies
				> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry
					? {
						[
						Entry in InferredEntriesDependenciesValue as Entry[0]
						]: Entry[1]
					}
					: never
			)
			& (
				{
					[
					Prop in keyof GenericDependencies as
					GenericDependencies[Prop] extends UseCaseHandler
						? Uncapitalize<Extract<Prop, string>>
						: never
					]?: GenericDependencies[Prop] extends UseCaseHandler
						? ReturnType<GenericDependencies[Prop]["getUseCase"]>
						: never
				}
			)
		>
	): GenericUseCase;
}

export function createUseCase<
	const GenericDependencies extends UseCaseDependencies,
	GenericUseCase extends(...args: any[]) => any,
>(
	dependencies: GenericDependencies,
	getUseCase: (
		dependenciesValue: UseCaseDependenciesValue<GenericDependencies>,
	) => GenericUseCase,
): UseCaseHandler<
	GenericDependencies,
	GenericUseCase
> {
	return {
		dependencies,
		getUseCase: (injectedDependencies: Record<string, object>) => getUseCase(
			DCommon.pipe(
				dependencies,
				DObject.entries,
				DArray.map(
					([key, value]) => {
						const formattedKey = DString.uncapitalize(key);

						return DObject.entry(
							formattedKey,
							useCaseHandlerKind.has(value) && !injectedDependencies[formattedKey]
								? value.getUseCase(injectedDependencies as never)
								: injectedDependencies[formattedKey]!,
						);
					},
				),
				DObject.fromEntries,
			) as never,
		),
		[useCaseHandlerKind.runTimeKey]: null,
	} satisfies DKind.Remove<UseCaseHandler> as never;
}

export function wireUseCases<
	GenericUseCases extends Record<string, UseCaseHandler>,
>(
	useCases: GenericUseCases,
	ports: DCommon.SimplifyTopLevel<
		DCommon.UnionToIntersection<
			{
				[Prop in keyof GenericUseCases]: GetAllPorts<
					GenericUseCases[Prop]["dependencies"]
				> extends infer InferredEntriesDependenciesValue extends DCommon.ObjectEntry
					? {
						[
						Entry in InferredEntriesDependenciesValue as Entry[0]
						]: Entry[1]
					}
					: never
			}[keyof GenericUseCases]
		>
	>,
): UseCaseDependenciesValue<GenericUseCases> {
	return DCommon.pipe(
		useCases,
		DObject.entries,
		DArray.map(
			([key, useCase]) => DObject.entry(
				DString.uncapitalize(key),
				useCase.getUseCase(ports as never),
			),
		),
		DObject.fromEntries,
	) as never;
}
