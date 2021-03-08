import { promises } from "fs";
import rimraf from "rimraf";
import createStructure from "../src/createStructure";

const { readdir } = promises;
const dir = `${process.cwd()}/testingDirectory`;

describe("creates base structure", () => {
  it("creates dirs", async () => {
    expect.assertions(2);
    const test = await createStructure(dir, ["alpha", "beta", "gamma"]);
    expect(test).toBeTruthy();

    const dirs = await readdir(dir);
    expect(JSON.stringify(dirs)).toStrictEqual(
      JSON.stringify(["alpha", "beta", "gamma"])
    );

    await rimraf(dir);
  });
});
