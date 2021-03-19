#!/usr/bin/env node

import { join, resolve } from "path";
import { exec } from "child_process";
import { promises } from "fs";
import { promisify } from "util";
import ora from "ora";

import prompt from "./prompt";
import getFiles from "./getFiles";
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

  // base dir, package.json, project name
  const projectInit = ora("Initializing project").start();
  // creates root dir
  await mkdir(projectPath);
  projectInit.succeed("Project initialized");

  // copy files!
  const copyFiles = ora("Copying template files").start();
  await getFiles(`${projectLang}-${projectType}`, projectPath);
  // replace $NAME$ in package.json with project name
  const packFile = await readFile(join(projectPath, "package.json"), "utf-8");
  const packReplace = packFile.replace(
    "$NAME$",
    projectPath.split(process.cwd()).join("").substring(1)
  );
  await writeFile(join(projectPath, "package.json"), packReplace, "utf-8");
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
