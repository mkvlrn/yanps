import { join } from "path";
import { promises } from "fs";
import { copy } from "fs-extra";
import simpleGit from "simple-git";

const { mkdir, rm } = promises;
const tempDir = join(process.cwd(), "temp");
const git = simpleGit();

export default async function getFiles(type: string, path: string) {
  await mkdir(tempDir);
  await git.clone("https://github.com/mkvlrn/yanps-templates", tempDir);

  // temp destiny
  const remote = join(tempDir, type.split("-")[0], type.split("-")[1]);

  // common files
  await copy(join(tempDir, "common", ".vscode"), join(path, ".vscode"));
  await copy(
    join(tempDir, "common", ".gitattributes"),
    join(path, ".gitattributes")
  );
  await copy(join(tempDir, "common", ".gitignore"), join(path, ".gitignore"));
  await copy(
    join(tempDir, "common", ".prettierrc.json"),
    join(path, ".prettierrc.json")
  );
  if (type.includes("react")) {
    await copy(
      join(tempDir, "common", ".postcssrc.json"),
      join(path, ".postcssrc.json")
    );
    await copy(
      join(tempDir, "common", "tailwind.config.json"),
      join(path, "tailwind.config.json")
    );
  }

  // targeted files
  await copy(remote, path);

  await rm(tempDir, { recursive: true, force: true });
}
