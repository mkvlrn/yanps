#!/usr/bin/env node

import { join, resolve } from "path";
import { exec } from "child_process";
import { promises } from "fs";
import { promisify } from "util";
import ora from "ora";
import simpleGit from "simple-git";

import prompt from "./prompt";

const pack: { version: string } = require("../package.json");

const { writeFile, readFile, mkdir, rm } = promises;
const doExec = promisify(exec);
const git = simpleGit();

(async () => {
  // prompt questions
  ora(`yanps v${pack.version}`).warn();
  ora("").stopAndPersist();
  const { path, template, pacman } = await prompt();
  ora("").stopAndPersist();

  // base dir, project name
  const projectInit = ora("Initializing project").start();
  // creates root dir
  await mkdir(path);
  projectInit.succeed("Project initialized");

  // copy files!
  const copyFiles = ora("Cloning template files").start();
  await git.clone(`https://github.com/mkvlrn/${template}`, path);
  // replace starter package name in package.json with project name
  const packFile = await readFile(join(path, "package.json"), "utf-8");
  const packReplace = packFile.replace(
    template,
    path.split(process.cwd()).join("").substring(1)
  );
  await writeFile(join(path, "package.json"), packReplace, "utf-8");
  // remove .git, readme, lock
  await rm(join(path, ".git"), { recursive: true, force: true });
  await rm(join(path, "readme.md"));
  await rm(join(path, "package-lock.json"), { force: true });
  await rm(join(path, "yarn.lock"), { force: true });
  await rm(join(path, "pnpm-lock.yaml"), { force: true });
  copyFiles.succeed("Files copied");

  // install dependencies
  const installDeps = ora(`Installing dependencies using ${pacman}`).start();
  await doExec(`${pacman} install`, { cwd: resolve(path) });
  installDeps.succeed("Dependencies installed");

  // bye!
  ora("").stopAndPersist();
  ora(
    `All done! CD into ${path
      .split(process.cwd())
      .join("")
      .substring(1)} and code away!`
  ).info();
  ora("").stopAndPersist();
})();
