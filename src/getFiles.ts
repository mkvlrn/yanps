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

  // targeted files
  await copy(remote, path);

  await rm(tempDir, { recursive: true, force: true });
}
