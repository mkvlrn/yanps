import { existsSync } from "fs";
import { join } from "path";
import { prompt } from "inquirer";
import { lookpath } from "lookpath";

type Answers = {
  projectLang: string;
  projectPath: string;
  projectReact: boolean;
  projectManager: string;
};

export default async function getPrompt(): Promise<Answers> {
  const dir = process.cwd();

  // everyone has npm. EVERYONE
  const managers = ["npm"];

  // checking for others
  const yarn = await lookpath("yarn");
  const pnpm = await lookpath("pnpm");

  // if others, add to array
  if (yarn) managers.push("yarn");
  if (pnpm) managers.push("pnpm");

  const answers: Answers = await prompt([
    {
      name: "projectLang",
      type: "list",
      message: "TypeScript or JavaScript?",
      default: "ts",
      choices: [
        { name: "TypeScript", value: "ts" },
        { name: "JavaScript", value: "js" },
      ],
    },
    {
      name: "projectPath",
      type: "input",
      message: "Project name (directory will be created in current path):",
      default: "my-project",
      validate: async (input) => {
        const reg = new RegExp(/^[\w\-.]+$/);
        if (!input.match(reg)) {
          return `"${input}" is an invalid path name`;
        }

        if (existsSync(join(dir, input))) {
          return "Directory already exists in this path";
        }

        return true;
      },
    },
    {
      name: "projectReact",
      type: "confirm",
      message: "Using React/Webpack?",
      default: true,
    },
    {
      name: "projectManager",
      type: "list",
      message: "What package manager would you like to use?",
      when: managers.length > 1,
      choices: managers,
      default: "npm",
    },
  ]);

  if (!answers.projectManager) {
    answers.projectManager = "npm";
  }
  return { ...answers, projectPath: join(dir, answers.projectPath) };
}
