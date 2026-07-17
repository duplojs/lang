import { existsSync, statSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const [, , outputPath, ...targets] = process.argv;

if (!outputPath) {
	throw new Error("Missing output path.");
}

if (targets.length === 0) {
	throw new Error("At least one target is required.");
}

const include = targets.map((target) => {
	const absoluteTarget = resolve(target);

	if (!existsSync(absoluteTarget)) {
		throw new Error(`Target not found: ${target}`);
	}

	const normalizedTarget = target
		.replace(/^\.\//, "")
		.replaceAll("\\", "/");

	return statSync(absoluteTarget).isDirectory()
		? `${normalizedTarget}/**/*.ts`
		: normalizedTarget;
});

writeFileSync(
	outputPath,
	`${JSON.stringify(
		{
			extends: "./tsconfig.test.json",
			include,
		},
		null,
		2,
	)}\n`,
);