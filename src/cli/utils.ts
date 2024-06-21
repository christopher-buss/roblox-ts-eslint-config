import { execSync } from "node:child_process";

export function isGitClean(): boolean {
	try {
		execSync("git diff-index --quiet HEAD --");
		return true;
	} catch {
		return false;
	}
}

export function getEslintConfigContent(
	mainConfig: string,
	additionalConfigs?: Array<string>,
): string {
	return `
import style from '@isentinel/eslint-config'

export default style({
${mainConfig}
}${additionalConfigs?.map(config => `,{\n${config}\n}`)})
`.trimStart();
}
