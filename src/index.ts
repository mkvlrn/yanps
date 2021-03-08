#!/usr/bin/env node

import { join, resolve } from "path";
import { exec } from "child_process";
import { promises } from "fs";
import { promisify } from "util";
import ora from "ora";

import prompt from "./prompt";
import getFile from "./getFile";
import dependencies from "./dependencies.json";

// json import shenanigans
type Deps = {
  [key: string]: { [index: string]: string[] };
};
const deps: Deps = dependencies;

const pack: { version: string } = require("../package.json");

(async () => {
  const { writeFile, readFile, mkdir } = promises;
  const doExec = promisify(exec);

  // prompt questions
  ora(`yanps v${pack.version}`).warn();
  ora("").stopAndPersist();
  const {
    projectLang,
    projectPath,
    projectType,
    projectManager,
  } = await prompt();
  ora("").stopAndPersist();

  // base dir, structure, package.json, project name
  const projectInit = ora("Initializing project").start();
  // creates root dir
  await mkdir(projectPath);
  // creates initial dirs on root
  await Promise.all(
    [".vscode", "src", "tests"].map(async (i) => {
      await mkdir(join(projectPath, i));
    })
  );
  // copies a template package.json file
  await getFile(
    `${projectLang}/${projectType}/package.json`,
    join(projectPath, "package.json")
  );
  // replace $NAME$ in package.json with project name
  const packFile = await readFile(join(projectPath, "package.json"), "utf-8");
  const packReplace = packFile.replace(
    "$NAME$",
    projectPath.split(process.cwd()).join("").substring(1)
  );
  await writeFile(join(projectPath, "package.json"), packReplace, "utf-8");
  projectInit.succeed("Project initialized");

  // direct copies to root
  const copyFiles = ora("Copying template files").start();
  await getFile("common/.gitattributes", join(projectPath, ".gitattributes"));
  await getFile("common/.gitignore", join(projectPath, ".gitignore"));
  await getFile(
    "common/.prettierrc.json",
    join(projectPath, ".prettierrc.json")
  );
  await getFile(
    "common/.vscode/extensions.json",
    join(projectPath, ".vscode", "extensions.json")
  );
  await getFile(
    "common/.vscode/settings.json",
    join(projectPath, ".vscode", "settings.json")
  );
  await getFile(
    `${projectLang}/${projectType}/jest.config.json`,
    join(projectPath, `jest.config.json`)
  );

  // babel file for js, tsconfig for ts
  if (projectLang === "js") {
    await getFile(
      `js/${projectType}/babel.config.json`,
      join(projectPath, `babel.config.json`)
    );
  } else {
    await getFile(
      `ts/${projectType}/tsconfig.json`,
      join(projectPath, "tsconfig.json")
    );
    await getFile(
      `ts/${projectType}/src/tsconfig.json`,
      join(projectPath, "src", "tsconfig.json")
    );
    await getFile(
      `ts/${projectType}/tests/tsconfig.json`,
      join(projectPath, "tests", "tsconfig.json")
    );
  }

  // eslint configs
  await getFile(
    `${projectLang}/${projectType}/.eslintrc.json`,
    join(projectPath, ".eslintrc.json")
  );
  await getFile(
    `${projectLang}/${projectType}/src/.eslintrc.json`,
    join(projectPath, "src", ".eslintrc.json")
  );
  await getFile(
    `${projectLang}/${projectType}/tests/.eslintrc.json`,
    join(projectPath, "tests", ".eslintrc.json")
  );

  // webpack config and boilerplate copy
  if (projectType === "react") {
    // static dir inside src
    await mkdir(join(projectPath, "src", "static"));

    // webpack config
    const wpFile = `webpack${
      projectLang === "ts" ? ".config.ts" : ".config.babel.js"
    }`;
    await getFile(`${projectLang}/react/${wpFile}`, join(projectPath, wpFile));
    await getFile(
      `${projectLang}/react/src/static/index.html`,
      join(projectPath, "src", "static", "index.html")
    );
    await getFile(
      `${projectLang}/react/src/index.${projectLang}x`,
      join(projectPath, "src", `index.${projectLang}x`)
    );
    await getFile(
      `${projectLang}/react/src/App.${projectLang}x`,
      join(projectPath, "src", `App.${projectLang}x`)
    );
  } else {
    // or just a node app
    await getFile(
      `${projectLang}/node/src/index.${projectLang}`,
      join(projectPath, "src", `index.${projectLang}`)
    );
  }
  copyFiles.succeed("Files copied");

  // install dependencies
  const installDeps = ora(
    `Installing dependencies using ${projectManager}`
  ).start();
  // react deps
  if (projectType === "react") {
    const reactDeps = deps[projectLang].reactProd.join(" ");
    await doExec(`${projectManager} add ${reactDeps}`, {
      cwd: resolve(projectPath),
    });
  }

  // devDependencies
  const devDeps = deps[projectLang][projectType].join(" ");
  await doExec(`${projectManager} add ${devDeps} -D`, {
    cwd: resolve(projectPath),
  });
  installDeps.succeed("Dependencies installed");

  // bye!
  ora("").stopAndPersist();
  ora(`All done! CD into ${projectPath} and code away!`).info();
  ora("").stopAndPersist();
})();
