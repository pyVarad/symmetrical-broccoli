import * as fs from "fs";
import * as path from "path";
import * as handlebars from "handlebars";
import * as fse from "fs-extra";
import { logger } from "../loggers/index.js";

/**
 * Checks if a given file or directory path exists.
 * @param filePath - The path to check.
 * @returns True if the path exists, false otherwise.
 */
export const isPathPresent = (filePath: string): boolean => {
  const status = fs.existsSync(filePath);
  if (!status) {
    logger.error(`Path does not exist: ${filePath}`);
  }
  return status;
};

/**
 * Deletes a file at the specified path.
 * @param filePath - The path of the file to delete.
 * @returns True if the file was deleted, false otherwise.
 */
export const deleteFile = (filePath: string): boolean => {
  if (!isPathPresent(filePath)) {
    return false;
  }
  try {
    fs.unlinkSync(filePath);
    logger.info(`File deleted: ${filePath}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting file: ${filePath}`, error);
    return false;
  }
};

/**
 * Reads the contents of a directory.
 * @param dirPath - The path of the directory to read.
 * @returns An array of file and directory names in the directory.
 */
export const readDirectory = (dirPath: string): string[] => {
  if (!isPathPresent(dirPath)) {
    return [];
  }
  try {
    const files = fs.readdirSync(dirPath);
    logger.info(`Directory read: ${dirPath}`);
    return files;
  } catch (error) {
    logger.error(`Error reading directory: ${dirPath}`, error);
    return [];
  }
};

/**
 * Joins multiple path segments into a single path.
 * @param paths - The path segments to join.
 * @returns The joined path string.
 */
export const getPath = (...paths: string[]): string => {
  const result = path.join(...paths);
  logger.info(`Constructed path: ${result}`);
  return result;
};

/**
 * Gets the file name and type (extension) from a file path.
 * @param filePath - The path of the file.
 * @returns An object containing the file name and type.
 */
export const getFileNameAndType = (
  filePath: string,
): { name: string; type: string } => {
  if (!isPathPresent(filePath)) {
    return { name: "", type: "" };
  }
  const fileName = path.basename(filePath);
  const fileType = path.extname(filePath).slice(1); // Remove the leading dot
  logger.info(`File name: ${fileName}, File type: ${fileType}`);
  return { name: fileName, type: fileType };
};

/**
 * Creates a new directory at the specified path.
 * @param dirPath - The path of the directory to create.
 * @param recursive - Whether to create parent directories if they do not exist.
 * @returns True if the directory was created, false otherwise.
 */
export const createDirectory = (dirPath: string, recursive: false): boolean => {
  if (isPathPresent(dirPath)) {
    logger.warn(`Directory already exists: ${dirPath}`);
    return false;
  }
  try {
    fs.mkdirSync(dirPath, { recursive: recursive });
    logger.info(`Directory created: ${dirPath}`);
    return true;
  } catch (error) {
    logger.error(`Error creating directory: ${dirPath}`, error);
    return false;
  }
};

/**
 * Changes the current working directory to the specified path.
 * @param dirPath - The path to change to.
 * @returns True if the directory was changed, false otherwise.
 */
export const changeDirectory = (dirPath: string): boolean => {
  if (!isPathPresent(dirPath)) {
    logger.error(`Directory does not exist: ${dirPath}`);
    return false;
  }
  try {
    process.chdir(dirPath);
    logger.info(`Changed directory to: ${dirPath}`);
    return true;
  } catch (error) {
    logger.error(`Error changing directory to: ${dirPath}`, error);
    return false;
  }
};

/**
 * Reads the contents of a file as a string.
 * @param filePath - The path of the file to read.
 * @returns The file contents as a string, or null if the file could not be read.
 */
export const readFile = (filePath: string): string | null => {
  if (!isPathPresent(filePath)) {
    return null;
  }
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    logger.info(`File read: ${filePath}`);
    return data;
  } catch (error) {
    logger.error(`Error reading file: ${filePath}`, error);
    return null;
  }
};

/**
 * Generates a string from a Handlebars template file and data.
 * @param filePath - The path to the Handlebars template file.
 * @param data - The data to inject into the template.
 * @returns The generated string, or an empty string on error.
 */
export const generateHandleBarsTemplate = (
  filePath: string,
  data: Record<string, string | boolean>,
): string => {
  if (!isPathPresent(filePath)) {
    return "";
  }
  try {
    const templateContent = readFile(filePath);
    const template = handlebars.compile(templateContent);
    const result = template(data);
    logger.info(`Template generated from: ${filePath}`);
    return result;
  } catch (error) {
    logger.error(`Error generating template from file: ${filePath}`, error);
    return "";
  }
};

/**
 * Writes content to a file at the specified path.
 * @param filePath - The path of the file to write.
 * @param content - The content to write to the file.
 * @returns True if the file was written successfully, false otherwise.
 */
export const writeFile = (filePath: string, content: string): boolean => {
  try {
    fs.writeFileSync(filePath, content, "utf-8");
    return true;
  } catch (error) {
    logger.error(`Error writing file: ${filePath}`, error);
    return false;
  }
};

/**
 * Recursively deletes a folder and its contents.
 * @param folderPath - The path of the folder to delete.
 * @returns True if the folder was deleted, false otherwise.
 */
export const cleanUpFilesAndFolders = (folderPath: string): boolean => {
  if (!isPathPresent(folderPath)) {
    return false;
  }
  try {
    fs.rmdirSync(folderPath, { recursive: true });
    logger.info(`Folder deleted: ${folderPath}`);
    return true;
  } catch (error) {
    logger.error(`Error deleting folder: ${folderPath}`, error);
    return false;
  }
};

/**
 * Recursively copies files and folders from a source to a destination.
 * @param source - The source path.
 * @param destination - The destination path.
 * @returns True if the copy was successful, false otherwise.
 */
export const copyFilesAndFoldersRecursively = (
  source: string,
  destination: string,
): boolean => {
  if (!isPathPresent(source)) {
    logger.error(`Source path does not exist: ${source}`);
    return false;
  }
  try {
    fse.copySync(source, destination, { overwrite: true });
    logger.info(`Copied files from ${source} to ${destination}`);
    return true;
  } catch (error) {
    logger.error(`Error copying files from ${source} to ${destination}`, error);
    return false;
  }
};

/**
 * Recursively walks a directory and returns a list of all files within it.
 * @param dir - The directory to walk.
 * @returns An array of file paths.
 */
export const walk = (dir: string): string[] => {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  list.forEach((file) => {
    file = dir + path.sep + file;
    const status = fse.statSync(file);
    if (status && status.isDirectory()) {
      results = results.concat(walk(file)); // Recurse into subdirectory
    } else {
      results.push(file); // Add file to results
    }
  });
  return results;
};

/**
 * Generates or updates a runtime configuration file for a given application target folder and type.
 *
 * If the configuration file does not exist, it will be created with an empty JSON object.
 * Then, the provided options will be merged into the existing configuration and written back to the file.
 *
 * @param appTargetFolder - The root folder of the application where the configuration should be placed.
 * @param type - The type of configuration (used as the filename, e.g., "dev", "prod").
 * @param options - A record of key-value pairs to merge into the configuration file.
 * @returns `true` if the configuration file was successfully created or updated, `false` otherwise.
 */
export const generateRunTimeConfiguration = (
  appTargetFolder: string,
  type: string,
  options: Record<string, string>,
): boolean => {
  const configFilePath = getPath(appTargetFolder, ".genrc", `${type}.json`);
  if (!isPathPresent(configFilePath)) {
    logger.error(`Configuration file does not exist: ${configFilePath}`);

    try {
      fse.ensureDirSync(path.dirname(configFilePath));
      writeFile(configFilePath, "{}");
      logger.info(`Created new configuration file: ${configFilePath}`);
    } catch (error) {
      logger.error(
        `Error creating configuration file: ${configFilePath}`,
        error,
      );
      return false;
    }
  }

  const configContent = readFile(configFilePath);
  if (configContent === null) {
    return false;
  }

  writeFile(
    configFilePath,
    JSON.stringify({ ...JSON.parse(configContent), ...options }, null, 2),
  );

  return true;
};
