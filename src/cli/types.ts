export interface PromItem<T> {
	hint?: string;
	label: string;
	value: T;
}

export type FrameworkOption = "react";

export interface PromptResult {
	frameworks: Array<FrameworkOption>;
	uncommittedConfirmed: boolean;
	updateVscodeSettings: unknown;
}
