import { promisify } from "util";
import { writeFile } from "fs";
import download from "download";

const doWrite = promisify(writeFile);

export default async function getFile(rawFile: string, dest: string) {
  const url = `https://raw.githubusercontent.com/mkvlrn/yanps/main/templates/${rawFile}`;

  try {
    await doWrite(dest, await download(url));
    return true;
  } catch (e) {
    return false;
  }
}
