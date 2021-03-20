import { existsSync } from "fs";
import { join } from "path";
import { prompt } from "inquirer";
import { lookpath } from "lookpath";

type Answers = {
  path: string;
  lang: string;
  type: string;
  pacman: string;
};

type RealAnswers = {
  path: string;
  clone: string;
  pacman: string;
};

export default async function getPrompt(): Promise<RealAnswers> {
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
      name: "path",
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
      name: "lang",
      type: "list",
      message: "TypeScript or JavaScript?",
      default: "typescript",
      choices: [
        { name: "TypeScript", value: "typescript" },
        { name: "JavaScript", value: "javascript" },
      ],
    },
    {
      name: "type",
      type: "list",
      message: "Project type:",
      default: "react",
      choices: [
        { name: "React PWA", value: "react" },
        { name: "Generic NodeJS project", value: "node" },
      ],
    },
    {
      name: "pacman",
      type: "list",
      message: "What package manager would you like to use?",
      when: managers.length > 1,
      choices: managers,
      default: "npm",
    },
  ]);

  const finalAnswers: RealAnswers = {
    path: join(dir, answers.path),
    clone: `starter-${answers.type}-${answers.lang}`,
    pacman: answers.pacman || "npm",
  };

  return finalAnswers;
}
