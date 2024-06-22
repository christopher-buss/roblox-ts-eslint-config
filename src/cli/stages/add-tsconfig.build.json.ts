import * as p from "@clack/prompts";

import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";
import pico from "picocolors";

export async function addTsconfigBuild(): Promise<void> {
	const cwd = process.cwd();

	const pathTsconfigBuild = path.join(cwd, "tsconfig.build.json");

	if (fs.existsSync(pathTsconfigBuild)) {
		p.log.info(pico.yellow("tsconfig.build.json already exists"));
		return;
	}

	const tsconfigBuildContent = `{
	"extends": "./tsconfig.json",
	"include": ["src/**/*", "eslint.config.ts"],
	"exclude": ["node_modules"]
	}
	`;

	await fsp.writeFile(pathTsconfigBuild, tsconfigBuildContent, "utf-8");
	p.log.success(pico.green(`Created tsconfig.build.json`));
	p.log.info(
		pico.yellow(
			`You must add '"exclude": ["./eslint.config.ts"]' to your tsconfig.json. In the future, this will be done automatically.`,
		),
	);
}
