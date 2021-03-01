#!/usr/bin/env node

import { join, resolve } from "path";
import { exec } from "child_process";
import { promises } from "fs";
import { promisify } from "util";
import ora from "ora";

import prompt from "./prompt";
import createStructure from "./createStructure";
import getFile from "./getFile";

import dependencies from "./dependencies.json";

(async () => {
  const { writeFile, readFile } = promises;
  const doExec = promisify(exec);
  const pack = await import("../package.json");

  // prompt
  ora(`yanps v${pack.version}`).warn();
  ora("").stopAndPersist();
  const { projectPath, projectReact, projectManager } = await prompt();
  ora("").stopAndPersist();

  // base dir, structure, package.json
  const projectInit = ora("Initializing project").start();
  await createStructure(projectPath, [".vscode", "src", "tests"]);
  const rawPack = `package.${projectReact ? "react" : "base"}.json`;
  await getFile(rawPack, join(projectPath, "package.json"));
  const packFile = await readFile(join(projectPath, "package.json"), "utf-8");
  const packReplace = packFile.replace(
    "$NAME$",
    projectPath.split(process.cwd()).join("").substring(1)
  );
  await writeFile(join(projectPath, "package.json"), packReplace, "utf-8");
  projectInit.succeed("Project initialized");

  // other direct copies
  const copyFiles = ora("Copying template files").start();
  await getFile(".gitattributes", join(projectPath, ".gitattributes"));
  await getFile(".gitignore", join(projectPath, ".gitignore"));
  await getFile(".prettierrc.json", join(projectPath, ".prettierrc.json"));
  await getFile(
    "vscode.extensions.json",
    join(projectPath, ".vscode", "extensions.json")
  );
  await getFile(
    "vscode.settings.json",
    join(projectPath, ".vscode", "settings.json")
  );
  await getFile(`jest.config.json`, join(projectPath, `jest.config.json`));
  await getFile(`babel.config.json`, join(projectPath, `babel.config.json`));

  // eslint copy
  await getFile(".eslintrc.root.json", join(projectPath, ".eslintrc.json"));
  const tempEslintSrc = `.eslintrc.src.${projectReact ? "react" : "base"}.json`;
  await getFile(tempEslintSrc, join(projectPath, "src", ".eslintrc.json"));
  const tempEslintTst = `.eslintrc.tests.${
    projectReact ? "react" : "base"
  }.json`;
  await getFile(tempEslintTst, join(projectPath, "tests", ".eslintrc.json"));

  // webpack copy
  if (projectReact) {
    await getFile(
      `webpack.config.babel.js`,
      join(projectPath, `webpack.config.babel.js`)
    );
  }

  copyFiles.succeed("Files copied");

  // install dependencies
  const installDeps = ora(
    `Installing dependencies using ${projectManager}`
  ).start();
  const deps = dependencies[projectReact ? "react" : "base"].join(" ");
  await doExec(`${projectManager} add ${deps} -D`, {
    cwd: resolve(projectPath),
  });
  installDeps.succeed("Dependencies installed");

  // bye!
  ora("All done!").info();
})();
