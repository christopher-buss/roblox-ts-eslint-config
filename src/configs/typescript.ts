import process from "node:process";
import type {
	FlatConfigItem,
	OptionsComponentExts,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
} from "../types";
import { GLOB_SRC } from "../globs";
import { pluginAntfu, pluginNoAutofix } from "../plugins";
import { interopDefault, renameRules, toArray } from "../utils";

export async function typescript(
	options: OptionsFiles &
		OptionsComponentExts &
		OptionsOverrides &
		OptionsTypeScriptWithTypes &
		OptionsTypeScriptParserOptions = {},
): Promise<Array<FlatConfigItem>> {
	const { componentExts = [], overrides = {}, parserOptions = {} } = options;

	const files = options.files ?? [GLOB_SRC, ...componentExts.map(ext => `**/*.${ext}`)];

	const typeAwareRules: FlatConfigItem["rules"] = {
		"dot-notation": "off",
		"no-implied-eval": "off",
		"no-throw-literal": "off",
		"no-unsafe-optional-chaining": "error",
		"ts/await-thenable": "error",
		"ts/consistent-type-assertions": [
			"error",
			{ assertionStyle: "as", objectLiteralTypeAssertions: "allow" },
		],
		"ts/dot-notation": ["error", { allowKeywords: true }],
		"ts/naming-convention": [
			"error",
			{
				custom: {
					match: false,
					regex: "^I[A-Z]",
				},
				format: ["PascalCase"],
				selector: "interface",
			},
		],
		"ts/no-duplicate-type-constituents": "error",
		"ts/no-floating-promises": [
			"error",
			{
				ignoreVoid: true,
			},
		],
		"ts/no-for-in-array": "error",
		"ts/no-implied-eval": "error",
		"ts/no-meaningless-void-operator": "error",
		"ts/no-misused-promises": "error",
		"ts/no-mixed-enums": "error",
		"ts/no-redundant-type-constituents": "error",
		"ts/no-throw-literal": "off",
		"ts/no-unnecessary-condition": "error",
		"ts/no-unnecessary-qualifier": "error",
		"ts/no-unnecessary-type-arguments": "error",
		"ts/no-unnecessary-type-assertion": "error",
		"ts/no-unsafe-argument": "error",
		"ts/no-unsafe-assignment": "error",
		"ts/no-unsafe-call": "error",
		"ts/no-unsafe-member-access": "error",
		"ts/no-unsafe-return": "error",
		"ts/non-nullable-type-assertion-style": "error",
		"ts/prefer-includes": "error",
		"ts/prefer-nullish-coalescing": "error",
		"ts/prefer-optional-chain": "error",
		"ts/prefer-readonly": "error",
		"ts/prefer-reduce-type-parameter": "error",
		"ts/prefer-return-this-type": "error",
		"ts/promise-function-async": "error",
		"ts/restrict-plus-operands": "error",
		"ts/restrict-template-expressions": "off",
		"ts/return-await": "error",
		"ts/unbound-method": "error",
	};

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;

	const [pluginTs, parserTs] = await Promise.all([
		interopDefault(import("@typescript-eslint/eslint-plugin")),
		interopDefault(import("@typescript-eslint/parser")),
	] as const);

	return [
		{
			// Install the plugins without globs, so they can be configured separately.
			name: "style:typescript:setup",
			plugins: {
				antfu: pluginAntfu,
				"no-autofix": pluginNoAutofix,
				ts: pluginTs as any,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					extraFileExtensions: componentExts.map(ext => `.${ext}`),
					sourceType: "module",
					...(tsconfigPath
						? {
								project: tsconfigPath,
								tsconfigRootDir: process.cwd(),
						  }
						: {}),
					...(parserOptions as any),
				},
			},
			name: "style:typescript:rules",
			rules: {
				...renameRules(
					pluginTs.configs["eslint-recommended"].overrides?.[0].rules ?? {},
					"@typescript-eslint/",
					"ts/",
				),
				...renameRules(pluginTs.configs.strict.rules ?? {}, "@typescript-eslint/", "ts/"),

				"no-autofix/no-useless-return": "error",
				"no-autofix/prefer-const": [
					"error",
					{
						destructuring: "all",
						ignoreReadBeforeAssign: true,
					},
				],
				"no-dupe-class-members": "off",
				"no-loss-of-precision": "off",
				"no-redeclare": "off",
				"no-use-before-define": "off",
				"no-useless-constructor": "off",
				"no-useless-return": "off",
				"prefer-const": "off",
				"ts/array-type": [
					"error",
					{
						default: "generic",
						readonly: "generic",
					},
				],
				"ts/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
				"ts/ban-types": ["error", { types: { Function: false } }],
				"ts/consistent-generic-constructors": ["error", "constructor"],
				"ts/consistent-indexed-object-style": ["error", "record"],
				"ts/consistent-type-definitions": ["error", "interface"],
				"ts/consistent-type-imports": [
					"error",
					{ disallowTypeAnnotations: false, prefer: "type-imports" },
				],
				"ts/default-param-last": "error",
				"ts/explicit-function-return-type": [
					"error",
					{
						allowExpressions: true,
					},
				],
				"ts/explicit-member-accessibility": [
					"error",
					{
						overrides: {
							constructors: "no-public",
						},
					},
				],
				"ts/max-params": ["error", { max: 4 }],
				"ts/method-signature-style": ["error", "property"],
				"ts/no-confusing-non-null-assertion": "error",
				"ts/no-dupe-class-members": "error",
				"ts/no-dynamic-delete": "off",
				"ts/no-empty-function": "error",
				"ts/no-empty-interface": "error",
				"ts/no-explicit-any": "off",
				"ts/no-extraneous-class": "off",
				"ts/no-for-in-array": "off",
				"ts/no-import-type-side-effects": "error",
				"ts/no-inferrable-types": "error",
				"ts/no-invalid-void-type": "off",
				"ts/no-loss-of-precision": "error",
				"ts/no-namespace": "off",
				"ts/no-non-null-assertion": "error",
				"ts/no-redeclare": "error",
				"ts/no-require-imports": "error",
				"ts/no-shadow": "error",
				"ts/no-throw-literal": "off",
				"ts/no-unused-vars": [
					"error",
					{
						argsIgnorePattern: "^_",
						caughtErrorsIgnorePattern: "^_",
						varsIgnorePattern: "^(Roact$|_)",
					},
				],
				"ts/no-use-before-define": [
					"error",
					{ classes: false, functions: false, variables: true },
				],
				"ts/no-useless-constructor": "error",
				"ts/prefer-for-of": "error",
				"ts/prefer-function-type": "error",
				"ts/prefer-ts-expect-error": "error",
				"ts/triple-slash-reference": "off",
				"ts/unified-signatures": "off",

				...(tsconfigPath ? typeAwareRules : {}),
				...overrides,
			},
		},
		{
			files: ["**/*.d.ts"],
			name: "style:typescript:dts-overrides",
			rules: {
				"eslint-comments/no-unlimited-disable": "off",
				"import/no-duplicates": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off",
			},
		},
		{
			files: ["**/*.js", "**/*.cjs"],
			name: "style:typescript:javascript-overrides",
			rules: {
				"ts/no-require-imports": "off",
				"ts/no-var-requires": "off",
			},
		},
	];
}
