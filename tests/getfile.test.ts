import { mkdir, readFile } from "fs/promises";
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

  it("downloads and saves file", async () => {
    expect.assertions(1);
    const test = await getFile("test.json", `${dir}/yolo.json`);
    expect(test).toBeTruthy();
  });

  it("downloaded the correct content", async () => {
    expect.assertions(1);
    const content = await readFile(`${dir}/yolo.json`, "utf-8");
    expect(JSON.parse(content)).toStrictEqual({ yolo: true });
  });
});
