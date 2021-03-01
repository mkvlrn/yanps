import { join, resolve } from "path";
import ora from "ora";

import prompt from "./prompt";
import createStructure from "./createStructure";
import getFile from "./getFile";

(async () => {
  ora("yanps").warn();
  const {
    projectPath,
    projectLang,
    projectReact,
    projectManager,
  } = await prompt();

  const projectInit = ora("Initializing project").start();
  await createStructure(projectPath, [".vscode", "src", "tests"]);
  const packFile = `project/${projectLang}-${
    projectReact ? "react" : "base"
  }.package.json`;
  console.log(packFile);
  await getFile(packFile, join(projectPath, "package.json"));
  projectInit.succeed("Project initialized");

  await getFile("git/.gitattributes", join(projectPath, ".gitattributes"));
})();
