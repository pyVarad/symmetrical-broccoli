import inquirer from "inquirer";

/**
 * Prompts the user with a series of questions to scaffold a new React application.
 *
 * Questions include:
 * - Application name
 * - Preset (JavaScript or TypeScript)
 * - Linter choice (Biome, ESLint, or None)
 * - Prettier formatting (if not using Biome)
 * - Unit testing setup
 *
 * @returns {Promise<void>} A promise that resolves when all questions have been answered.
 */
export const askReactAppQuestions = async (): Promise<
  Record<string, string>
> => {
  const answers: any = {};

  // App name
  /**
   * Prompt for the React application name.
   */
  const { appName } = await inquirer.prompt({
    type: "input",
    name: "appName",
    message: "What is the name of your React application?",
    validate: (input) => (input ? true : "App name cannot be empty."),
  });
  answers.appName = appName;

  // Preset
  /**
   * Prompt for the language preset (JavaScript or TypeScript).
   */
  const { preset } = await inquirer.prompt({
    type: "list",
    name: "preset",
    message: "Which preset do you want to use?",
    choices: ["JavaScript", "TypeScript"],
    default: "TypeScript",
  });
  answers.preset = preset;

  // Lint options
  /**
   * Prompt for the linter choice (Biome, ESLint, or None).
   */
  const { lint } = await inquirer.prompt({
    type: "list",
    name: "lint",
    message: "Which linter do you want to use?",
    choices: ["Biome", "ESLint", "None"],
    default: "Biome",
  });
  answers.lint = lint;

  // If Biome is selected, skip Prettier
  if (lint !== "Biome") {
    /**
     * Prompt for Prettier formatting if Biome is not selected.
     */
    const { prettier } = await inquirer.prompt({
      type: "confirm",
      name: "prettier",
      message: "Do you want to use Prettier for code formatting?",
      default: true,
    });
    answers.prettier = prettier;
  } else {
    answers.prettier = false;
  }

  // Include tests
  /**
   * Prompt for including unit testing setup.
   */
  const { includeTests } = await inquirer.prompt({
    type: "confirm",
    name: "includeTests",
    message: "Do you want to include unit testing setup?",
    default: true,
  });
  answers.includeTests = includeTests;

  // Add more questions as needed for your context

  return answers;
};
