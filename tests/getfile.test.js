import { mkdir, readFile } from "fs/promises";
import { join } from "path";
import rimraf from "rimraf";
import getFile from "../src/getFile";

const dir = `${process.cwd()}/testingDirectory`;

describe("can download files from github", () => {
  beforeAll(async () => {
    await mkdir(dir);
  });

  afterAll(async () => {
    rimraf(dir, () => {});
  });

  const tempFile = join(dir, ".prettierrc.json");
  it("downloads and saves file", async () => {
    expect.assertions(1);
    const test = await getFile("prettier/.prettierrc.json", tempFile);
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
  });
});
