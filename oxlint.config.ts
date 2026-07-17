import { defineConfig } from "oxlint";
import { openConfig, testPreset } from "@duplojs/code-config/oxlint";

export default defineConfig({
	extends: [openConfig],
	options: {
		...openConfig.options,
		typeAware: true,
		typeCheck: true,
	},
	overrides: [
		{
			files: [
				"**/*.test.ts",
				"**/*.bench.ts",
				"integrations/**/*.ts",
			],
			excludeFiles: ["**/*.d.ts"],
			rules: {
				...testPreset.rules,
			},
		},
	],
	ignorePatterns: [
		"coverage/**",
		"dist/**",
		".commands/**",
		".agents/**",
	],
});
