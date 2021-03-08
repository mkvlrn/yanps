import { join } from "path";
import { promises } from "fs";

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
