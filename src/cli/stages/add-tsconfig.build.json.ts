import { log } from "@clack/prompts";

import ansis from "ansis";
import fs from "node:fs";
import fsp from "node:fs/promises";
import path from "path";

export async function addTsconfigBuild(): Promise<void> {
	const cwd = process.cwd();

	const pathTsconfigBuild = path.join(cwd, "tsconfig.build.json");

	if (fs.existsSync(pathTsconfigBuild)) {
		log.info(ansis.yellow("tsconfig.build.json already exists"));
		return;
	}

	const tsconfigBuildContent = `{
	"extends": "./tsconfig.json",
	"include": ["src/**/*", "eslint.config.ts"],
	"exclude": ["node_modules"]
	}
	`;

	await fsp.writeFile(pathTsconfigBuild, tsconfigBuildContent, "utf-8");
	log.success(ansis.green("Created tsconfig.build.json"));
	log.info(
		ansis.yellow(
			'You must add \'"exclude": ["./eslint.config.ts"]\' to your tsconfig.json. In the future, this will be done automatically.',
		),
	);
}
