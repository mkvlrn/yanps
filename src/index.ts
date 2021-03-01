import { join, resolve } from "path";
import { exec } from "child_process";
import { promises } from "fs";
import { promisify } from "util";
import ora from "ora";

import prompt from "./prompt";
import createStructure from "./createStructure";
import getFile from "./getFile";

import dependencies from "../templates/dependencies.json";

(async () => {
  const { writeFile, readFile } = promises;
  const doExec = promisify(exec);
  const selfPack = await import("../package.json");

  // prompt
  ora(`yanps v${selfPack.version}`).warn();
  ora("").stopAndPersist();
  const {
    projectPath,
    projectLang,
    projectReact,
    projectManager,
  } = await prompt();
  ora("").stopAndPersist();

  // base dir, structure, package.json
  const projectInit = ora("Initializing project").start();
  await createStructure(projectPath, [".vscode", "src", "tests"]);
  const rawPack = `project/${projectLang}-${
    projectReact ? "react" : "base"
  }.package.json`;
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
  await getFile("git/.gitattributes", join(projectPath, ".gitattributes"));
  await getFile("git/.gitignore", join(projectPath, ".gitignore"));
  await getFile(
    "prettier/.prettierrc.json",
    join(projectPath, ".prettierrc.json")
  );
  await getFile(
    "vscode/extensions.json",
    join(projectPath, ".vscode", "extensions.json")
  );
  await getFile(
    "vscode/settings.json",
    join(projectPath, ".vscode", "settings.json")
  );
  await getFile(
    `jest/jest.config.${projectLang}`,
    join(projectPath, `jest.config.${projectLang}`)
  );

  // eslint copy
  const tempEslintRoot = `eslint/${projectLang}/.eslintrc.root.json`;
  await getFile(tempEslintRoot, join(projectPath, ".eslintrc.json"));
  const tempEslintSrc = `eslint/${projectLang}/.eslintrc.src.${
    projectReact ? "react" : "base"
  }.json`;
  await getFile(tempEslintSrc, join(projectPath, "src", ".eslintrc.json"));
  const tempEslintTst = `eslint/${projectLang}/.eslintrc.tests.${
    projectReact ? "react" : "base"
  }.json`;
  await getFile(tempEslintTst, join(projectPath, "tests", ".eslintrc.json"));

  // webpack copy
  if (projectReact) {
    await getFile(
      `webpack/webpack.config.${projectLang}`,
      join(projectPath, `webpack.config.${projectLang}`)
    );
  }

  // tsconfig copy
  if (projectLang === "ts") {
    await getFile(
      "tsconfig/tsconfig.root.json",
      join(projectPath, "tsconfig.json")
    );
    await getFile(
      `tsconfig/tsconfig.src.${projectReact ? "react" : "base"}.json`,
      join(projectPath, "tsconfig.src.json")
    );
    await getFile(
      `tsconfig/tsconfig.tests.${projectReact ? "react" : "base"}.json`,
      join(projectPath, "tsconfig.tests.json")
    );
  }
  copyFiles.succeed("Files copied");

  // install dependencies
  const installDeps = ora(
    `Installing dependencies using ${projectManager}`
  ).start();
  const deps = dependencies[projectLang][projectReact ? "react" : "base"].join(
    " "
  );
  await doExec(`${projectManager} add ${deps} -D`, {
    cwd: resolve(projectPath),
  });
  installDeps.succeed("Dependencies installed");

  // bye!
  ora("All done!\n").info();
})();
