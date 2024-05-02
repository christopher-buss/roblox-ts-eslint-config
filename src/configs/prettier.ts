import { GLOB_SRC } from "src";
import type { VendoredPrettierOptions } from "src/vender/prettier-types";

import { configPrettier, pluginFormat } from "../plugins";
import type {
	OptionsComponentExtensions,
	OptionsFiles,
	OptionsOverrides,
	OptionsTypeScriptParserOptions,
	OptionsTypeScriptWithTypes,
	TypedFlatConfigItem,
} from "../types";

interface PrettierPluginJsdocOptions {
	jsdocPreferCodeFences: boolean;
	jsdocPrintWidth: number;
	tsdoc: boolean;
}

export async function prettier(
	options: OptionsComponentExtensions &
		OptionsFiles &
		OptionsOverrides &
		OptionsTypeScriptParserOptions &
		OptionsTypeScriptWithTypes = {},
): Promise<Array<TypedFlatConfigItem>> {
	const { componentExts: componentExtensions = [] } = options;

	const files = options.files ?? [
		GLOB_SRC,
		...componentExtensions.map(extension => `**/*.${extension}`),
	];

	// TODO: Pull this from the local prettier config
	const prettierOptions: PrettierPluginJsdocOptions & VendoredPrettierOptions = {
		arrowParens: "avoid",
		jsdocPreferCodeFences: true,
		jsdocPrintWidth: 80,
		plugins: ["prettier-plugin-jsdoc"],
		printWidth: 100,
		semi: true,
		singleQuote: false,
		tabWidth: 4,
		trailingComma: "all",
		tsdoc: true,
		useTabs: true,
	} satisfies PrettierPluginJsdocOptions & VendoredPrettierOptions;

	return [
		{
			files,
			plugins: {
				format: pluginFormat,
			},
			rules: {
				...configPrettier.rules,
				"arrow-body-style": "off",
				curly: ["error", "all"],
				"format/prettier": [
					"error",
					{
						...prettierOptions,
						parser: "typescript",
					},
				],
				"no-unexpected-multiline": "off",
				"prefer-arrow-callback": "off",
				"standard/array-bracket-even-spacing": "off",
				"standard/computed-property-even-spacing": "off",
				"standard/object-curly-even-spacing": "off",
				"style/array-bracket-newline": "off",
				"style/array-bracket-spacing": "off",
				"style/array-element-newline": "off",
				"style/arrow-parens": "off",
				"style/arrow-spacing": "off",
				"style/block-spacing": "off",
				"style/brace-style": "off",
				"style/comma-dangle": "off",
				"style/comma-spacing": "off",
				"style/comma-style": "off",
				"style/computed-property-spacing": "off",
				"style/dot-location": "off",
				"style/eol-last": "off",
				"style/func-call-spacing": "off",
				"style/function-call-argument-newline": "off",
				"style/function-paren-newline": "off",
				"style/generator-star-spacing": "off",
				"style/implicit-arrow-linebreak": "off",
				"style/indent": "off",
				"style/indent-binary-ops": "off",
				"style/jsx-child-element-spacing": "off",
				"style/jsx-closing-bracket-location": "off",
				"style/jsx-closing-tag-location": "off",
				"style/jsx-curly-newline": "off",
				"style/jsx-curly-spacing": "off",
				"style/jsx-equals-spacing": "off",
				"style/jsx-first-prop-new-line": "off",
				"style/jsx-indent": "off",
				"style/jsx-indent-props": "off",
				"style/jsx-max-props-per-line": "off",
				"style/jsx-newline": "off",
				"style/jsx-one-expression-per-line": "off",
				"style/jsx-props-no-multi-spaces": "off",
				"style/jsx-quotes": "off",
				"style/jsx-tag-spacing": "off",
				"style/jsx-wrap-multilines": "off",
				"style/key-spacing": "off",
				"style/keyword-spacing": "off",
				"style/linebreak-style": "off",
				"style/lines-around-comment": "off",
				"style/max-len": "off",
				"style/max-statements-per-line": "off",
				"style/member-delimiter-style": "off",
				"style/multiline-ternary": "off",
				"style/new-parens": "off",
				"style/newline-per-chained-call": "off",
				"style/no-confusing-arrow": "off",
				"style/no-extra-parens": "off",
				"style/no-extra-semi": "off",
				"style/no-floating-decimal": "off",
				"style/no-mixed-operators": "off",
				"style/no-mixed-spaces-and-tabs": "off",
				"style/no-multi-spaces": "off",
				"style/no-multiple-empty-lines": "off",
				"style/no-tabs": "off",
				"style/no-trailing-spaces": "off",
				"style/no-whitespace-before-property": "off",
				"style/nonblock-statement-body-position": "off",
				"style/object-curly-newline": "off",
				"style/object-curly-spacing": "off",
				"style/object-property-newline": "off",
				"style/one-var-declaration-per-line": "off",
				"style/operator-linebreak": "off",
				"style/padded-blocks": "off",
				"style/quote-props": "off",
				"style/quotes": "off",
				"style/rest-spread-spacing": "off",
				"style/semi": "off",
				"style/semi-spacing": "off",
				"style/semi-style": "off",
				"style/space-before-blocks": "off",
				"style/space-before-function-paren": "off",
				"style/space-in-parens": "off",
				"style/space-infix-ops": "off",
				"style/space-unary-ops": "off",
				"style/switch-colon-spacing": "off",
				"style/template-curly-spacing": "off",
				"style/template-tag-spacing": "off",
				"style/type-annotation-spacing": "off",
				"style/wrap-iife": "off",
				"style/wrap-regex": "off",
				"style/yield-star-spacing": "off",
				"unicorn/empty-brace-spaces": "off",
				"unicorn/number-literal-case": "off",
				"unicorn/template-indent": "off",
			},
		},
	];
}
