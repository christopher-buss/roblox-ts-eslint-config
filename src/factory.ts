import type { Linter } from "eslint";
import { FlatConfigComposer } from "eslint-flat-config-utils";
import fs from "node:fs";

import {
	comments,
	ignores,
	imports,
	jsdoc,
	jsonc,
	markdown,
	perfectionist,
	prettier,
	promise,
	react,
	roblox,
	shopify,
	sonarjs,
	sortPackageJson,
	sortTsconfig,
	stylistic,
	toml,
	typescript,
	unicorn,
	yaml,
} from "./configs";
import { formatters } from "./configs/formatters";
import type { Awaitable, ConfigNames, OptionsConfig, TypedFlatConfigItem } from "./types";
import { getOverrides, interopDefault, resolveSubOptions } from "./utils";

const flatConfigProps: Array<keyof TypedFlatConfigItem> = [
	"name",
	"files",
	"ignores",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
];

export const defaultPluginRenaming = {
	"@eslint-react": "react",
	"@eslint-react/hooks-extra": "react-hooks-extra",
	"@eslint-react/naming-convention": "react-naming-convention",
	"@stylistic": "style",
	"@typescript-eslint": "ts",
	yml: "yaml",
};

/**
 * Generates an array of user configuration items based on the provided options
 * and user configs.
 *
 * @param options - The options for generating the user configuration items.
 * @param userConfigs - Additional user configuration items.
 * @returns A promise that resolves to an array of user configuration items.
 */
export function style(
	options: OptionsConfig & TypedFlatConfigItem = {},
	...userConfigs: Array<
		Awaitable<
			| Array<Linter.FlatConfig>
			| Array<TypedFlatConfigItem>
			| FlatConfigComposer<any, any>
			| TypedFlatConfigItem
		>
	>
): FlatConfigComposer<TypedFlatConfigItem, ConfigNames> {
	const {
		autoRenamePlugins = true,
		componentExts: componentExtensions = [],
		gitignore: enableGitignore = true,
		jsx,
		typescript: enableTypeScript,
	} = options;

	const stylisticOptions =
		options.stylistic === false
			? false
			: typeof options.stylistic === "object"
				? options.stylistic
				: {};
	if (stylisticOptions && !("jsx" in stylisticOptions)) {
		stylisticOptions.jsx = jsx ?? true;
	}

	const configs: Array<Awaitable<Array<TypedFlatConfigItem>>> = [];

	/* eslint-disable arrow-style/arrow-return-style -- Bug with line length. */
	if (enableGitignore) {
		if (typeof enableGitignore !== "boolean") {
			configs.push(
				interopDefault(import("eslint-config-flat-gitignore")).then(resolved => {
					return [resolved(enableGitignore)];
				}),
			);
		} else if (fs.existsSync(".gitignore")) {
			configs.push(
				interopDefault(import("eslint-config-flat-gitignore")).then(resolved => {
					return [resolved()];
				}),
			);
		} else {
			throw new Error(
				"gitignore option is enabled but no .gitignore file was found in the current directory",
			);
		}
	}
	/* eslint-enable arrow-style/arrow-return-style -- Bug with line length. */

	// Base configs
	configs.push(
		ignores(),
		comments(),
		imports({
			stylistic: stylisticOptions,
		}),
		promise(),
		shopify(),
		sonarjs(),
		unicorn(),
		perfectionist(),
		typescript({
			...resolveSubOptions(options, "typescript"),
			componentExts: componentExtensions,
		}),
	);

	if (options.roblox ?? true) {
		configs.push(
			roblox({
				...resolveSubOptions(options, "typescript"),
				componentExts: componentExtensions,
			}),
		);
	}

	if (stylisticOptions) {
		configs.push(stylistic(stylisticOptions));
	}

	if (options.react) {
		configs.push(
			react({
				overrides: getOverrides(options, "react"),
				tsconfigPath: getOverrides(options, "typescript").tsconfigPath,
			}),
		);
	}

	if (options.jsdoc ?? true) {
		configs.push(
			jsdoc({
				stylistic: stylisticOptions,
			}),
		);
	}

	if (options.jsonc ?? true) {
		configs.push(
			jsonc({
				overrides: getOverrides(options, "jsonc"),
				stylistic: stylisticOptions,
			}),
			sortPackageJson(),
			sortTsconfig(),
		);
	}

	if (options.yaml ?? true) {
		configs.push(
			yaml({
				overrides: getOverrides(options, "yaml"),
				stylistic: stylisticOptions,
			}),
		);
	}

	if (options.toml ?? true) {
		configs.push(
			toml({
				overrides: getOverrides(options, "toml"),
				stylistic: stylisticOptions,
			}),
		);
	}

	if (options.markdown ?? true) {
		configs.push(
			markdown({
				componentExts: componentExtensions,
				overrides: getOverrides(options, "markdown"),
			}),
		);
	}

	if (options.formatters) {
		configs.push(
			formatters(
				options.formatters,
				typeof stylisticOptions === "boolean" ? {} : stylisticOptions,
				options.markdown !== false,
			),
		);
	}

	// We require prettier to be the last config
	configs.push(
		prettier({
			...(typeof enableTypeScript !== "boolean" ? enableTypeScript : {}),
			componentExts: componentExtensions,
			overrides: getOverrides(options, "typescript"),
			prettierOptions:
				typeof options["formatters"] === "boolean"
					? ({} as any)
					: options["formatters"]?.prettierOptions || {},
		}),
	);

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = flatConfigProps.reduce((accumulator, key) => {
		if (key in options) {
			accumulator[key] = options[key] as any;
		}

		return accumulator;
	}, {} as TypedFlatConfigItem);
	if (Object.keys(fusedConfig).length) {
		configs.push([fusedConfig]);
	}

	let composer = new FlatConfigComposer<TypedFlatConfigItem, ConfigNames>();

	composer = composer.append(...configs, ...(userConfigs as any));

	if (autoRenamePlugins) {
		composer = composer.renamePlugins(defaultPluginRenaming);
	}

	return composer;
}
