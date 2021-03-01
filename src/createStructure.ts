import { promises } from "fs";
import { join } from "path";

/**
 *
 * @param dest CWD where dirs will be created
 * @param struct List of directories to be created
 * @returns Success of creation
 */
export default async function createStructure(dest: string, struct: string[]) {
  const { mkdir } = promises;

  try {
    await mkdir(dest);

    await Promise.all(
      struct.map(async (i) => {
        await mkdir(join(dest, i));
      })
    );

    return true;
  } catch (e) {
    return false;
  }
}
