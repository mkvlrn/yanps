import prompt from "./prompt";
import createStructure from "./createStructure";
import getFile from "./getFile";

(async () => {
  const answers = await prompt();

  await createStructure(answers.path, [".vscode", "src", "tests"]);
})();
