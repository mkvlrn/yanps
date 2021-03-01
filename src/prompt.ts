import { existsSync } from "fs";
import { join } from "path";
import { prompt } from "inquirer";

interface Answers {
  path: string;
  lang: string;
  react: boolean;
}

export default async function getPrompt(): Promise<Answers> {
  const dir = process.cwd();

  const answers = await prompt([
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
      message: "TypeScript or JavaScript project?",
      default: "ts",
      choices: [
        { name: "TypeScript", value: "ts" },
        { name: "JavaScript", value: "js" },
      ],
    },
    {
      name: "react",
      type: "confirm",
      message: "Using React/Webpack?",
      default: true,
    },
  ]);

  return { ...answers, path: join(dir, answers.path) };
}
