import { GLOB_EXCLUDE, GLOB_JS } from "../globs";
import type { TypedFlatConfigItem } from "../types";

export async function ignores(): Promise<Array<TypedFlatConfigItem>> {
	return [
		{
			ignores: [...GLOB_EXCLUDE, GLOB_JS],
		},
	];
}
