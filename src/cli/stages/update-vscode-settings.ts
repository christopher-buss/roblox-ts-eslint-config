import { log } from "@clack/prompts";

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import pico from "picocolors";

import { vscodeSettingsString } from "../constants";
import type { PromptResult } from "../types";

export async function updateVscodeSettings(result: PromptResult): Promise<void> {
	const cwd = process.cwd();

	if (!result.updateVscodeSettings) {
		return;
	}

	const dotVscodePath: string = path.join(cwd, ".vscode");
	const settingsPath: string = path.join(dotVscodePath, "settings.json");

	if (!fs.existsSync(dotVscodePath)) {
		await fsp.mkdir(dotVscodePath, { recursive: true });
	}

	if (!fs.existsSync(settingsPath)) {
		await fsp.writeFile(settingsPath, `{${vscodeSettingsString}}\n`, "utf-8");
		log.success(pico.green(`Created .vscode/settings.json`));
		return;
	}

	let settingsContent = await fsp.readFile(settingsPath, "utf8");

	settingsContent = settingsContent.trim().replace(/\s*\}$/, "");
	settingsContent += settingsContent.endsWith(",") || settingsContent.endsWith("{") ? "" : ",";
	settingsContent += `${vscodeSettingsString}}\n`;

	await fsp.writeFile(settingsPath, settingsContent, "utf-8");
	log.success(pico.green(`Updated .vscode/settings.json`));
}
