import { askReactAppQuestions } from "@app-gen-cli/shared";

async function run() {
  const answers = await askReactAppQuestions();
  console.log("Collected Answers:", answers);
}

run();
