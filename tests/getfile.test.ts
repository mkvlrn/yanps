import { promises } from "fs";
import { join } from "path";
import rimraf from "rimraf";
import getFile from "../src/getFile";

const { mkdir, readFile } = promises;
const dir = `${process.cwd()}/testingDirectory`;

async function createTestDir() {
  await mkdir(dir);
}

function cleanupTestDir() {
  rimraf(dir, () => {});
}

describe("can download files from github", () => {
  const tempFile = join(dir, ".prettierrc.json");

  it("downloads and saves file", async () => {
    expect.assertions(1);

    cleanupTestDir();
    await createTestDir();
    const test = await getFile("common/.prettierrc.json", tempFile);
    expect(test).toBeTruthy();
  });

  it("downloaded the correct content", async () => {
    expect.assertions(1);

    const content = await readFile(tempFile, "utf-8");
    expect(JSON.parse(content)).toStrictEqual({
      overrides: [
        {
          files: ["*.json"],
          options: {
            parser: "json-stringify",
          },
        },
      ],
    });
    cleanupTestDir();
  });
});
