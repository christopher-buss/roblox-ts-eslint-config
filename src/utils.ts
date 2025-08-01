import { isPackageExists } from "local-pkg";
import fs from "node:fs";
import path from "node:path";
import process from "node:process";

import type { Awaitable, OptionsConfig, TypedFlatConfigItem } from "./types";

export const parserPlain = {
	meta: {
		name: "parser-plain",
	},
	parseForESLint: (code: string) => {
		return {
			ast: {
				body: [],
				comments: [],
				loc: { end: code.length, start: 0 },
				range: [0, code.length],
				tokens: [],
				type: "Program",
			},
			scopeManager: null,
			services: { isPlain: true },
			visitorKeys: {
				Program: [],
			},
		};
	},
};

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

/**
 * Combine array and non-array configs into a single array.
 *
 * @param configs - The configs to combine.
 * @returns The combined array.
 */
export async function combine(
	...configs: Array<Awaitable<Array<TypedFlatConfigItem> | TypedFlatConfigItem>>
): Promise<Array<TypedFlatConfigItem>> {
	const resolved = await Promise.all(configs);
	return resolved.flat();
}

export function createTsParser(options: {
	componentExtensions?: Array<string>;
	configName: string;
	files: Array<string>;
	ignores?: Array<string>;
	parser: any;
	parserOptions?: any;
	tsconfigPath?: string;
	typeAware: boolean;
}): TypedFlatConfigItem {
	const {
		componentExtensions = [],
		configName,
		files,
		ignores,
		parser,
		parserOptions = {},
		tsconfigPath,
		typeAware,
	} = options;

	return {
		files,
		ignores: ignores ?? [],
		languageOptions: {
			parser,
			parserOptions: {
				ecmaVersion: 2018,
				extraFileExtensions: componentExtensions.map((extension) => `.${extension}`),
				sourceType: "module",
				useJSXTextNode: true,
				...(typeAware
					? {
							projectService: {
								allowDefaultProject: ["*.js", "*.ts"],
								defaultProject: tsconfigPath,
							},
							tsconfigRootDir: process.cwd(),
						}
					: {
							program: null,
							project: false,
							projectService: false,
						}),
				...parserOptions,
			},
		},
		name: `style/${configName}/${typeAware ? "type-aware-parser" : "parser"}`,
	};
}

export async function ensurePackages(packages: Array<string | undefined>): Promise<void> {
	if (process.env.CI || process.stdout.isTTY === false) {
		return;
	}

	const nonExistingPackages = packages.filter(
		(index) => index && !isPackageExists(index),
	) as Array<string>;
	if (nonExistingPackages.length === 0) {
		return;
	}

	const prompts = await import("@clack/prompts");
	const result = await prompts.confirm({
		message: `${nonExistingPackages.length === 1 ? "Package is" : "Packages are"} required for this config: ${nonExistingPackages.join(", ")}. Do you want to install them?`,
	});
	if (result) {
		await import("@antfu/install-pkg").then((index) =>
			index.installPackage(nonExistingPackages, { dev: true }),
		);
	}
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): any {
	const sub = resolveSubOptions(options, key);

	return {
		...("overrides" in sub ? sub.overrides : {}),
	};
}

export function getTsConfig(tsconfigPath?: string): string | undefined {
	if (tsconfigPath !== undefined) {
		return tsconfigPath;
	}

	// Check if tsconfig.json exists in the project root
	const rootTsConfig = path.join(process.cwd(), "tsconfig.json");

	if (fs.existsSync(rootTsConfig)) {
		return rootTsConfig;
	}

	return undefined;
}

export async function interopDefault<T>(
	dynamicImport: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await dynamicImport;
	return (resolved as any).default || resolved;
}

export function isInEditorEnvironment(): boolean {
	if (process.env.CI) {
		return false;
	}

	if (isInGitHooksOrLintStaged()) {
		return false;
	}

	return [
		process.env.VSCODE_PID,
		process.env.VSCODE_CWD,
		process.env.JETBRAINS_IDE,
		process.env.VIM,
		process.env.NVIM,
	].some(Boolean);
}

export function isInGitHooksOrLintStaged(): boolean {
	return [
		process.env.GIT_PARAMS ||
			process.env.VSCODE_GIT_COMMAND ||
			process.env.npm_lifecycle_script?.startsWith("lint-staged"),
	].some(Boolean);
}

/**
 * Rename plugin names a flat configs array.
 *
 * @example
 *
 * ```ts
 * import { renamePluginInConfigs } from "@antfu/eslint-config";
 * import someConfigs from "./some-configs";
 *
 * export default renamePluginInConfigs(someConfigs, {
 * 	"@typescript-eslint": "ts",
 * 	"import-x": "import",
 * });
 * ```
 *
 * @param configs - The configs array to rename.
 * @param map - A map of prefixes to rename.
 * @returns The renamed configs array.
 */
export function renamePluginInConfigs(
	configs: Array<TypedFlatConfigItem>,
	map: Record<string, string>,
): Array<TypedFlatConfigItem> {
	return configs.map((index) => {
		const clone = { ...index };
		if (clone.rules) {
			clone.rules = renameRules(clone.rules, map);
		}

		if (clone.plugins) {
			clone.plugins = Object.fromEntries(
				Object.entries(clone.plugins).map(([key, value]) => {
					if (key in map) {
						return [map[key], value];
					}

					return [key, value];
				}),
			);
		}

		return clone;
	});
}

/**
 * Rename plugin prefixes in a rule object. Accepts a map of prefixes to rename.
 *
 * @example
 *
 * ```ts
 * import { renameRules } from "@antfu/eslint-config";
 *
 * export default [
 * 	{
 * 		rules: renameRules(
 * 			{
 * 				"@typescript-eslint/indent": "error",
 * 			},
 * 			{ "@typescript-eslint": "ts" },
 * 		),
 * 	},
 * ];
 * ```
 *
 * @param rules - The rules object to rename.
 * @param map - A map of prefixes to rename.
 * @returns The renamed rules object.
 */
export function renameRules(
	rules: Record<string, any>,
	map: Record<string, string>,
): Record<string, any> {
	return Object.fromEntries(
		Object.entries(rules).map(([key, value]) => {
			for (const [from, to] of Object.entries(map)) {
				if (key.startsWith(`${from}/`)) {
					return [to + key.slice(from.length), value];
				}
			}

			return [key, value];
		}),
	);
}

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === "boolean" ? ({} as any) : options[key] || ({} as any);
}

export function toArray<T>(value: Array<T> | T): Array<T> {
	return Array.isArray(value) ? value : [value];
}
