import type { Url } from "./constraints";

const regexRemoveDote = /:$/;

export interface IsUrlParams {
	hostname?: RegExp;
	protocol?: RegExp;
}

export function isUrl<
	GenericValue extends string,
>(
	string: GenericValue,
	params?: IsUrlParams,
): string is GenericValue & Url;

export function isUrl(
	string: string,
	params?: IsUrlParams,
) {
	try {
		const url = new URL(string);

		if (params?.hostname) {
			params.hostname.lastIndex = 0;

			if (!params.hostname.test(url.hostname)) {
				return false;
			}
		}

		if (params?.protocol) {
			params.protocol.lastIndex = 0;

			if (!params.protocol.test(url.protocol.replace(regexRemoveDote, ""))) {
				return false;
			}
		}

		return true;
	} catch {
		return false;
	}
}
