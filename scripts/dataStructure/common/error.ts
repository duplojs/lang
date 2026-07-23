import { type Constraint } from "../constraint";
import { type FundamentalType } from "../fundamentalType";
import { type Structure } from "../structure";
import { type Type } from "../type";
import { ErrorSymbol } from "./resultSymbol";

export interface Issue {
	readonly context: (
		| "default"
		| "encode"
		| "decode"
	);
	readonly path: string;
	getSource(): (
		| Type
		| Structure<any>
		| FundamentalType
		| Constraint
	);
}

export interface PathStageErrorHandler {
	setCurrentPath(path: string): void;
	close(): void;
}

export interface Error {
	readonly issues: readonly Issue[];
}

export interface ErrorHandler {
	readonly issues: readonly Issue[];
	readonly currentPath: string[];
	setCurrentContext(context: Issue["context"]): void;
	addIssue(source: ReturnType<Issue["getSource"]>): ErrorSymbol;
	createPathStage(): PathStageErrorHandler;
	createError(): Error;
}

export function createErrorHandler(): ErrorHandler {
	let currentStagePath = 0;

	const issues: Issue[] = [];
	const currentPath: string[] = [];

	let currentStage: PathStageErrorHandler | undefined = undefined;
	let context: Issue["context"] = "default";

	return {
		currentPath,
		issues,
		createPathStage: () => {
			if (currentStage === undefined) {
				currentStage = {
					setCurrentPath: (path: string) => {
						currentPath[currentStagePath] = path;
					},
					close: () => {
						if (currentStagePath === 0) {
							return;
						}

						if (currentPath.length !== currentStagePath) {
							currentPath.pop();
						}

						currentStagePath--;
					},
				};
			}
			currentStagePath++;

			return currentStage;
		},
		setCurrentContext: (newContext) => {
			context = newContext;
		},
		addIssue: (source) => {
			issues.push({
				context,
				getSource: () => source,
				path: currentPath.join("."),
			});
			return ErrorSymbol;
		},
		createError: () => ({ issues }),
	};
}

export type GetErrorHandler = () => ErrorHandler;

export function createGetErrorHandler(): GetErrorHandler {
	let errorHandler: undefined | ErrorHandler = undefined;

	return () => {
		if (errorHandler === undefined) {
			errorHandler = createErrorHandler();
		}

		return errorHandler;
	};
}
