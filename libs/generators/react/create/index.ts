import { ipc } from "@app-gen-cli/shared";
import { fsUtils } from "@app-gen-cli/shared";

export const createReactApp = (appTargetDirectory: string, name: string) => {
  const args = {
    name: name,
    template: "react-ts",
    otherArgs: [],
  };

  if (fsUtils.isPathPresent(appTargetDirectory)) {
    fsUtils.changeDirectory(appTargetDirectory);
  }

  const cmdArgs = [args.name, "--template", args.template, ...args.otherArgs];
  ipc.ipcPipeEventSync(`npx create-vite@latest`, cmdArgs, "inherit");
};
