import { promises } from "fs";
import { join } from "path";
import rimraf from "rimraf";
import getFile from "../src/getFile";

const { mkdir, readFile } = promises;
const dir = `${process.cwd()}/testingDirectory`;

describe("can download files from github", () => {
  const tempFile = join(dir, ".prettierrc.json");
  it("downloads and saves file", async () => {
    expect.assertions(1);

    await mkdir(dir);
    const test = await getFile("prettier/.prettierrc.json", tempFile);
    expect(test).toBeTruthy();
    await rimraf(dir);
  });

  it("downloaded the correct content", async () => {
    expect.assertions(1);

    await mkdir(dir);
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
    await rimraf(dir);
  });
});
