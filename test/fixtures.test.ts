import { join, resolve } from "node:path";
import { afterAll, beforeAll, it } from "vitest";
import fs from "fs-extra";
import { execa } from "execa";
import fg from "fast-glob";
import type { FlatConfigItem, OptionsConfig } from "../src/types";

beforeAll(async () => {
	await fs.rm("_fixtures", { force: true, recursive: true });
});
afterAll(async () => {
	await fs.rm("_fixtures", { force: true, recursive: true });
});

runWithConfig("js", {
	typescript: false,
});
runWithConfig("all", {
	typescript: true,
});
runWithConfig("no-style", {
	stylistic: false,
	typescript: true,
});
runWithConfig(
	"tab-double-quotes",
	{
		stylistic: {
			indent: "tab",
			quotes: "double",
		},
		typescript: true,
	},
	{
		rules: {
			"style/no-mixed-spaces-and-tabs": "off",
		},
	},
);

// https://github.com/antfu/eslint-config/issues/255
runWithConfig(
	"ts-override",
	{
		typescript: true,
	},
	{
		rules: {
			"ts/consistent-type-definitions": ["error", "type"],
		},
	},
);

runWithConfig("with-formatters", {
	formatters: true,
	typescript: true,
});

runWithConfig("no-markdown-with-formatters", {
	formatters: {
		markdown: true,
	},
	jsx: false,
	markdown: false,
});

function runWithConfig(
	name: string,
	configs: OptionsConfig,
	...items: Array<FlatConfigItem>
): void {
	it.concurrent(
		name,
		async ({ expect }) => {
			const from = resolve("fixtures/input");
			const output = resolve("fixtures/output", name);
			const target = resolve("_fixtures", name);

			await fs.copy(from, target, {
				filter: src => {
					return !src.includes("node_modules");
				},
			});
			await fs.writeFile(
				join(target, "eslint.config.js"),
				`
// @eslint-disable
import antfu from '@antfu/eslint-config'

export default antfu(
  ${JSON.stringify(configs)},
  ...${JSON.stringify(items) ?? []},
)
  `,
			);

			await execa("npx", ["eslint", ".", "--fix"], {
				cwd: target,
				stdio: "pipe",
			});

			const files = await fg("**/*", {
				cwd: target,
				ignore: ["node_modules", "eslint.config.js"],
			});

			await Promise.all(
				files.map(async file => {
					const content = await fs.readFile(join(target, file), "utf-8");
					const source = await fs.readFile(join(from, file), "utf-8");
					const outputPath = join(output, file);
					if (content === source) {
						if (fs.existsSync(outputPath)) {
							void fs.remove(outputPath);
						}

						return;
					}

					await expect.soft(content).toMatchFileSnapshot(join(output, file));
				}),
			);
		},
		30_000,
	);
}
