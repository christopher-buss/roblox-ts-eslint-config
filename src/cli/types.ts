export type FrameworkOption = "react";

export interface PromItem<T> {
	hint?: string;
	label: string;
	value: T;
}

export interface PromptResult {
	frameworks: Array<FrameworkOption>;
	uncommittedConfirmed: boolean;
	updateVscodeSettings: unknown;
}
