import { existsSync } from "fs";
import { join } from "path";
import { prompt } from "inquirer";
import { lookpath } from "lookpath";

type Prompt = {
  path: string;
  lang: string;
  template: string;
  pacman: string;
};

type Result = {
  path: string;
  template: string;
  pacman: string;
};

const projects = [
  { name: "React PWA", value: "react" },
  { name: "Generic NodeJS Project", value: "node" },
];

export default async function getPrompt(): Promise<Result> {
  const dir = process.cwd();

  // everyone has npm
  const managers = ["npm"];

  // checking for others
  const pnpm = await lookpath("pnpm");
  const yarn = await lookpath("yarn");

  // if others, add to array
  if (pnpm) managers.push("pnpm");
  if (yarn) managers.push("yarn");

  const answers = await prompt<Prompt>([
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
      message: "Project language:",
      default: "typescript",
      choices: [
        { name: "TypeScript 😎", value: "typescript" },
        { name: "JavaScript 😔", value: "javascript" },
      ],
    },
    {
      name: "template",
      type: "list",
      message: "Project type:",
      default: "react",
      choices: [
        ...projects.map((p) => ({
          name: `${p.name}`,
          value: `${p.value}`,
        })),
      ],
    },
    {
      name: "pacman",
      type: "list",
      message: "Pick a package manager:",
      when: managers.length > 1,
      choices: managers,
      default: "npm",
    },
  ]);

  return {
    path: join(dir, answers.path),
    template: `starter-${answers.template}-${answers.lang}`,
    pacman: answers.pacman || "npm",
  };
}
