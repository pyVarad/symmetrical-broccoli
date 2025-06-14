import { questionnaire } from "@app-gen-cli/shared";
import { reactAppGen } from "@app-gen-cli/generators";

async function run() {
  const answers = await questionnaire.askReactAppQuestions();
  console.log("Answers:", answers);
  reactAppGen("/Users/varad/code/testing/react-apps", answers.appName);
}

run();
