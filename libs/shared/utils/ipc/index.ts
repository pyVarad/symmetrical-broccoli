import { spawnSync } from "child_process";

/**
 * Synchronously spawns a child process to execute a command with the given arguments.
 *
 * @param cmd - The command to run.
 * @param args - An array of string arguments to pass to the command.
 * @param showlog - Determines how stdio is handled: 'inherit', 'pipe', or 'ignore'. Defaults to 'inherit'.
 *
 * @remarks
 * Uses `spawnSync` with `shell: true` and `encoding: 'utf-8'`.
 * The function does not return the result of the spawned process.
 */
export const ipcPipeEventSync = (
  cmd: string,
  args: string[],
  showlog: "inherit" | "pipe" | "ignore" = "inherit",
) => {
  spawnSync(cmd, args, {
    stdio: showlog,
    shell: true,
    encoding: "utf-8",
  });
};
