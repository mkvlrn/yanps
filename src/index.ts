import { join, resolve } from "path";
import { exec } from "child_process";
import { promisify } from "util";
import ora from "ora";

import prompt from "./prompt";
import createStructure from "./createStructure";
import getFile from "./getFile";

(async () => {
  const doExec = promisify(exec);

  ora("yanps").warn();
  const {
    projectPath,
    projectLang,
    projectReact,
    projectManager,
  } = await prompt();

  const projectInit = ora("Initializing project").start();
  await createStructure(projectPath, [".vscode", "src", "tests"]);
  await doExec(`${projectManager} init -y`, { cwd: resolve(projectPath) });
  projectInit.succeed("Project initialized");

  await getFile("git/.gitattributes", join(projectPath, ".gitattributes"));
})();
