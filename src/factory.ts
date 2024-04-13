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
	typescript,
	unicorn,
} from "./configs";
import { formatters } from "./configs/formatters";
import type { Awaitable, FlatConfigItem, OptionsConfig, UserConfigItem } from "./types";
import { combine, getOverrides, interopDefault, resolveSubOptions } from "./utils";

const flatConfigProps: Array<keyof FlatConfigItem> = [
	"files",
	"ignores",
	"languageOptions",
	"linterOptions",
	"processor",
	"plugins",
	"rules",
	"settings",
];

/**
 * Generates an array of user configuration items based on the provided options
 * and user configs.
 *
 * @param options - The options for generating the user configuration items.
 * @param userConfigs - Additional user configuration items.
 * @returns A promise that resolves to an array of user configuration items.
 */
export async function style(
	options: OptionsConfig & FlatConfigItem = {},
	...userConfigs: Array<Awaitable<UserConfigItem | Array<UserConfigItem>>>
): Promise<Array<UserConfigItem>> {
	const {
		componentExts: componentExtensions = [],
		gitignore: enableGitignore = true,
		jsx,
		react: enableReact = false,
		roblox: enableRoblox = true,
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

	const configs: Array<Awaitable<Array<FlatConfigItem>>> = [];

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
		jsdoc({
			stylistic: stylisticOptions,
		}),
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

	if (enableRoblox) {
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

	if (enableReact) {
		configs.push(
			react({
				overrides: getOverrides(options, "react"),
				typescript: !!enableTypeScript,
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

	if (options.markdown ?? true) {
		configs.push(
			markdown(
				{
					componentExts: componentExtensions,
					overrides: getOverrides(options, "markdown"),
				},

				options.formatters === true || !!(options.formatters || {})?.markdown,
			),
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
		}),
	);

	// User can optionally pass a flat config item to the first argument
	// We pick the known keys as ESLint would do schema validation
	const fusedConfig = flatConfigProps.reduce((accumulator, key) => {
		if (key in options) {
			accumulator[key] = options[key] as any;
		}

		return accumulator;
	}, {} as FlatConfigItem);

	if (Object.keys(fusedConfig).length) {
		configs.push([fusedConfig]);
	}

	return combine(...configs, ...userConfigs);
}
