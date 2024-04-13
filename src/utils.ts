import { isPackageExists } from "local-pkg";
import process from "node:process";

import type { Awaitable, OptionsConfig, UserConfigItem } from "./types";

/**
 * Combine array and non-array configs into a single array.
 *
 * @param configs - Array of configs or a single config.
 * @returns Combined array of configs.
 */
export async function combine(
	...configs: Array<Awaitable<UserConfigItem | Array<UserConfigItem>>>
): Promise<Array<UserConfigItem>> {
	const resolved = await Promise.all(configs);
	return resolved.flat();
}

export function renameRules(
	rules: Record<string, any>,
	from: string,
	to: string,
): Record<string, any> {
	return Object.fromEntries(
		Object.entries(rules).map(([key, value]) => {
			if (key.startsWith(from)) {
				return [to + key.slice(from.length), value];
			}

			return [key, value];
		}),
	);
}

export function toArray<T>(value: T | Array<T>): Array<T> {
	return Array.isArray(value) ? value : [value];
}

export async function interopDefault<T>(
	dynamicImport: Awaitable<T>,
): Promise<T extends { default: infer U } ? U : T> {
	const resolved = await dynamicImport;
	return (resolved as any).default || resolved;
}

export async function ensurePackages(packages: Array<string>): Promise<void> {
	if (process.env.CI ?? process.stdout.isTTY === false) {
		return;
	}

	const nonExistingPackages = packages.filter(index => !isPackageExists(index));
	if (nonExistingPackages.length === 0) {
		return;
	}

	const { default: prompts } = await import("prompts");
	const { result } = await prompts([
		{
			message: `${
				nonExistingPackages.length === 1 ? "Package is" : "Packages are"
			} required for this config: ${nonExistingPackages.join(
				", ",
			)}. Do you want to install them?`,
			name: "result",
			type: "confirm",
		},
	]);

	if (result) {
		await import("@antfu/install-pkg").then(import_ =>
			import_.installPackage(nonExistingPackages, { dev: true }),
		);
	}
}

export type ResolvedOptions<T> = T extends boolean ? never : NonNullable<T>;

export function resolveSubOptions<K extends keyof OptionsConfig>(
	options: OptionsConfig,
	key: K,
): ResolvedOptions<OptionsConfig[K]> {
	return typeof options[key] === "boolean" ? ({} as any) : options[key] || {};
}

export function getOverrides<K extends keyof OptionsConfig>(options: OptionsConfig, key: K): any {
	const sub = resolveSubOptions(options, key);

	return {
		...("overrides" in sub ? sub.overrides : {}),
	};
}
