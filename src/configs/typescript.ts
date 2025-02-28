import process from "node:process";

import { GLOB_SRC } from "../globs";
import { pluginAntfu, pluginDeMorgan, pluginMaxParams as pluginMaxParameters } from "../plugins";
import type {
	OptionsComponentExtensions,
	OptionsFiles,
	OptionsIsInEditor,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";
import { interopDefault, renameRules, toArray } from "../utils";

export async function typescript(
	options: OptionsComponentExtensions &
		OptionsFiles &
		OptionsIsInEditor &
		OptionsOverrides &
		OptionsTypeScriptParserOptions &
		OptionsTypeScriptWithTypes = {},
): Promise<Array<TypedFlatConfigItem>> {
	const {
		componentExts: componentExtensions = [],
		isInEditor = false,
		overrides = {},
		parserOptions = {},
	} = options;

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

	const typeAwareRules: TypedFlatConfigItem["rules"] = {
		"dot-notation": "off",
		"no-implied-eval": "off",
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
		"ts/no-confusing-void-expression": "error",
		"ts/no-duplicate-type-constituents": "error",
		"ts/no-empty-object-type": "error",
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
		"ts/no-unnecessary-boolean-literal-compare": "error",
		"ts/no-unnecessary-condition": ["error", { allowConstantLoopConditions: true }],
		"ts/no-unnecessary-parameter-property-assignment": "error",
		"ts/no-unnecessary-qualifier": "error",
		"ts/no-unnecessary-template-expression": "error",
		"ts/no-unnecessary-type-arguments": "error",
		"ts/no-unnecessary-type-assertion": "error",
		"ts/no-unnecessary-type-constraint": "error",
		"ts/no-unnecessary-type-parameters": "error",
		"ts/no-unsafe-argument": "error",
		"ts/no-unsafe-assignment": "error",
		"ts/no-unsafe-call": "error",
		"ts/no-unsafe-member-access": "error",
		"ts/no-unsafe-return": "error",
		"ts/non-nullable-type-assertion-style": "error",
		"ts/prefer-destructuring": "error",
		"ts/prefer-find": "error",
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
		"ts/strict-boolean-expressions": "error",
		"ts/switch-exhaustiveness-check": "error",
		"ts/unbound-method": "error",
	};

	const tsconfigPath = options?.tsconfigPath ? toArray(options.tsconfigPath) : undefined;

	const [pluginTs, parserTs] = await Promise.all([
		interopDefault(import("@typescript-eslint/eslint-plugin")),
		interopDefault(import("@typescript-eslint/parser")),
	] as const);

	return [
		{
			// Install the plugins without globs, so they can be configured
			// separately.
			name: "style/typescript:setup",
			plugins: {
				"antfu": pluginAntfu,
				"better-max-params": pluginMaxParameters,
				["de-morgan"]: pluginDeMorgan,
				"ts": pluginTs,
			},
		},
		{
			files,
			languageOptions: {
				parser: parserTs,
				parserOptions: {
					ecmaVersion: 2018,
					extraFileExtensions: componentExtensions.map(extension => `.${extension}`),
					jsx: true,
					sourceType: "module",
					useJSXTextNode: true,
					...(tsconfigPath
						? {
								project: tsconfigPath,
								tsconfigRootDir: process.cwd(),
							}
						: {}),
					...(parserOptions as any),
				},
			},
			name: "style/typescript:rules",
			rules: {
				...renameRules(pluginTs.configs["eslint-recommended"].overrides?.[0].rules ?? {}, {
					"@typescript-eslint": "ts",
				}),
				...renameRules(pluginTs.configs.strict.rules ?? {}, { "@typescript-eslint": "ts" }),

				"antfu/no-top-level-await": "error",
				"array-callback-return": [
					"error",
					{
						allowImplicit: true,
					},
				],
				"better-max-params/better-max-params": [
					"error",
					{
						func: 4,
					},
				],
				"camelcase": "error",

				"de-morgan/no-negated-conjunction": "error",
				"de-morgan/no-negated-disjunction": "error",

				"eqeqeq": "error",
				"id-length": [
					"error",
					{
						exceptions: ["_", "x", "y", "z", "a", "b", "e"],
						max: 30,
						min: 2,
						properties: "never",
					},
				],
				"logical-assignment-operators": "error",
				"max-classes-per-file": "error",
				"max-depth": "error",
				"max-lines": ["warn", { max: 300, skipBlankLines: true, skipComments: true }],
				"max-lines-per-function": [
					"warn",
					{ max: 30, skipBlankLines: true, skipComments: true },
				],
				"no-constant-condition": [
					"error",
					{
						checkLoops: false,
					},
				],
				"no-dupe-class-members": "off",
				"no-else-return": "error",
				"no-empty-function": "off",
				"no-lonely-if": "error",
				"no-loss-of-precision": "off",
				"no-redeclare": "off",
				"no-return-assign": ["error", "always"],
				"no-shadow": "off",
				"no-unneeded-ternary": "error",
				"no-unused-expressions": [
					"error",
					{
						allowShortCircuit: true,
						allowTaggedTemplates: true,
						allowTernary: true,
					},
				],
				"no-unused-private-class-members": "error",
				"no-use-before-define": "off",
				"no-useless-constructor": "off",
				"no-useless-rename": "error",
				"no-useless-return": "error",
				"object-shorthand": "error",
				"prefer-const": [
					isInEditor ? "warn" : "error",
					{
						destructuring: "all",
						ignoreReadBeforeAssign: true,
					},
				],
				"prefer-destructuring": "off",
				"ts/adjacent-overload-signatures": "off",
				"ts/array-type": [
					"error",
					{
						default: "generic",
						readonly: "generic",
					},
				],
				"ts/ban-ts-comment": ["error", { "ts-ignore": "allow-with-description" }],
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
				"ts/method-signature-style": "off",
				"ts/no-array-constructor": "off",
				"ts/no-confusing-non-null-assertion": "error",
				"ts/no-dupe-class-members": "error",
				"ts/no-dynamic-delete": "off",
				"ts/no-empty-function": "error",
				"ts/no-empty-object-type": ["error", { allowInterfaces: "always" }],
				"ts/no-explicit-any": "off",
				"ts/no-extraneous-class": "error",
				"ts/no-for-in-array": "off",
				"ts/no-import-type-side-effects": "error",
				"ts/no-inferrable-types": "error",
				"ts/no-invalid-void-type": "off",
				"ts/no-namespace": "off",
				"ts/no-non-null-assertion": "error",
				"ts/no-redeclare": "off",
				"ts/no-require-imports": "error",
				"ts/no-shadow": "error",
				"ts/no-unused-expressions": "error",
				"ts/no-unused-vars": [
					"error",
					{
						argsIgnorePattern: "^_",
						caughtErrorsIgnorePattern: "^_",
						reportUsedIgnorePattern: true,
						varsIgnorePattern: "^_",
					},
				],
				"ts/no-use-before-define": "off",
				"ts/no-useless-constructor": "error",
				"ts/no-wrapper-object-types": "error",
				"ts/prefer-for-of": "error",
				"ts/prefer-function-type": "error",
				"ts/prefer-literal-enum-member": ["error", { allowBitwiseExpressions: true }],
				"ts/triple-slash-reference": "off",

				"ts/unified-signatures": "off",
				"yoda": ["error", "never"],

				...(tsconfigPath ? typeAwareRules : {}),
				...overrides,
			},
		},
		{
			files: ["**/*.d.ts"],
			name: "style/typescript:dts-overrides",
			rules: {
				"eslint-comments/no-unlimited-disable": "off",
				"import/no-duplicates": "off",
				"max-lines": "off",
				"no-restricted-syntax": "off",
				"unused-imports/no-unused-vars": "off",
			},
		},
	];
}
