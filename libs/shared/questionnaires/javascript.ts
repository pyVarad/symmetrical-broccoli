import inquirer from "inquirer";

export async function askReactAppQuestions() {
  const answers: any = {};

  // App name
  const { appName } = await inquirer.prompt({
    type: "input",
    name: "appName",
    message: "What is the name of your React application?",
    validate: (input) => input ? true : "App name cannot be empty."
  });
  answers.appName = appName;

  // Preset
  const { preset } = await inquirer.prompt({
    type: "list",
    name: "preset",
    message: "Which preset do you want to use?",
    choices: ["JavaScript", "TypeScript"],
    default: "TypeScript"
  });
  answers.preset = preset;

  // Lint options
  const { lint } = await inquirer.prompt({
    type: "list",
    name: "lint",
    message: "Which linter do you want to use?",
    choices: ["Biome", "ESLint", "None"],
    default: "Biome"
  });
  answers.lint = lint;

  // If Biome is selected, skip Prettier
  if (lint !== "Biome") {
    const { prettier } = await inquirer.prompt({
      type: "confirm",
      name: "prettier",
      message: "Do you want to use Prettier for code formatting?",
      default: true
    });
    answers.prettier = prettier;
  } else {
    answers.prettier = false;
  }

  // Include tests
  const { includeTests } = await inquirer.prompt({
    type: "confirm",
    name: "includeTests",
    message: "Do you want to include unit testing setup?",
    default: true
  });
  answers.includeTests = includeTests;

  // Add more questions as needed for your context

  return answers;
}
