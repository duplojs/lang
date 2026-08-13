import { createGlobalStore } from "./globalStore";
import type * as DObject from "@scripts/object";
import type { ObjectKey, Adaptor, AnyFunction, AnyValue } from "./types";

const SymbolOverrideStore = Symbol.for("@duplojs/lang/override");

declare module "./globalStore" {
	interface GlobalStore {
		[SymbolOverrideStore]: Record<
			string,
			Record<ObjectKey, unknown>
		>;
	}
}

const overrideStore = createGlobalStore(SymbolOverrideStore, {});

export interface OverrideHandler<
	GenericInterface extends object,
> {
	setMethod<
		GenericProperty extends DObject.GetPropsWithValueExtends<
			GenericInterface,
			AnyFunction
		>,
	>(
		property: GenericProperty,
		method: (
			self: GenericInterface,
			...args: Parameters<GenericInterface[GenericProperty]>
		) => ReturnType<GenericInterface[GenericProperty]>
	): void;

	setPropertyDefaultValue<
		GenericProperty extends Exclude<
			keyof GenericInterface,
			DObject.GetPropsWithValueExtends<
				GenericInterface,
				AnyFunction
			>
		>,
	>(
		property: GenericProperty,
		value: Adaptor<GenericInterface[GenericProperty], AnyValue>
	): void;

	apply(input: GenericInterface): GenericInterface;
}

export function createOverride<
	GenericInterface extends object,
>(
	overrideName: string,
): OverrideHandler<GenericInterface>;

export function createOverride<
	GenericInterface extends object,
>(
	overrideName: string,
): OverrideHandler<GenericInterface> {
	const overridePropertiesStore = overrideStore.value[overrideName] ?? {};
	overrideStore.value[overrideName] ||= overridePropertiesStore;

	return {
		setMethod(property, method) {
			overridePropertiesStore[property] = method;
		},
		setPropertyDefaultValue(property, value) {
			overridePropertiesStore[property as string] = value;
		},
		apply(input) {
			const injectOverrideStoreFunction = input[SymbolOverrideStore as never] as (
				| undefined
				| typeof injectOverrideStore
			);
			if (injectOverrideStoreFunction) {
				injectOverrideStoreFunction(overridePropertiesStore);
				return input;
			}

			const overrideStoreList = [overridePropertiesStore];

			const cachedOverrideProperties: Record<ObjectKey, unknown> = {};
			function injectOverrideStore(store: Record<ObjectKey, unknown>) {
				overrideStoreList.unshift(store);
			}

			const proxyHandler = {
				get(_target: object, property: ObjectKey): unknown {
					if (property in input) {
						return input[property as keyof typeof input];
					}

					if (property in cachedOverrideProperties) {
						return cachedOverrideProperties[property];
					}

					for (const store of overrideStoreList) {
						if (property in store) {
							cachedOverrideProperties[property] = typeof overridePropertiesStore[property] === "function"
								? (...args: unknown[]) => (
									overridePropertiesStore[property] as AnyFunction
								)(self, ...args)
								: overridePropertiesStore[property];

							return cachedOverrideProperties[property];
						}
					}

					if (property === SymbolOverrideStore) {
						return injectOverrideStore;
					}

					return undefined;
				},
				ownKeys() {
					const result = Object.keys(input);

					for (const store of overrideStoreList) {
						for (const property in store) {
							if (!result.includes(property)) {
								result.push(property);
							}
						}
					}

					return result;
				},
				has(_target: object, property: ObjectKey) {
					if (
						property in input
						|| property in cachedOverrideProperties
					) {
						return true;
					}

					for (const store of overrideStoreList) {
						if (property in store) {
							return true;
						}
					}

					return false;
				},
				getOwnPropertyDescriptor(target: object, property: ObjectKey) {
					return {
						enumerable: true,
						configurable: true,
						value: proxyHandler.get(target, property),
					};
				},
			};

			const self = new Proxy(
				cachedOverrideProperties,
				proxyHandler,
			);

			void ({ ...self });

			return self as never;
		},
	};
}
