import { mkdir, readdir } from "fs/promises";
import rimraf from "rimraf";
import createStructure from "../src/createStructure";

const dir = `${process.cwd()}/testingDirectory`;

describe("creates base structure", () => {
  beforeAll(async () => {
    await mkdir(dir);
  });

  afterAll(async () => {
    rimraf(dir, () => {});
  });

  it("creates dirs", async () => {
    expect.assertions(2);
    const test = await createStructure(dir, ["alpha", "beta", "gamma"]);
    expect(test).toBeTruthy();

    const dirs = await readdir(dir);
    expect(JSON.stringify(dirs)).toStrictEqual(
      JSON.stringify(["alpha", "beta", "gamma"])
    );
  });
});
