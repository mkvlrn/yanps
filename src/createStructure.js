import { join } from "path";
import { promises } from "fs";

/**
 * @param {string} dest CWD where dirs will be created
 * @param {string[]} struct List of directories to be created
 * @returns {boolean} Success of creation
 */
export default async function createStructure(dest, struct) {
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

createStructure(2, 4);
