// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";

// Import reactAppGen dynamically
const { reactAppGen } = require("@app-gen-cli/generators");

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "codegen-plugin" is now active!',
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposable = vscode.commands.registerCommand(
    "codegen-plugin.reactgenerator",
    async () => {
      // Create and show a new webview panel
      const panel = vscode.window.createWebviewPanel(
        "formApp",
        "React App Generator",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        },
      );
      
      // Set the webview's HTML content
      panel.webview.html = getWebviewContent();

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        async (message) => {
          if (message.command === "submit") {
            try {
              // Use fixed directory path
              const targetDir = "/Users/varad/code/testing/react-apps";
              
              // Ensure the directory exists
              if (!fs.existsSync(targetDir)) {
                fs.mkdirSync(targetDir, { recursive: true });
              }
              
              vscode.window.showInformationMessage(
                `Creating React app "${message.name}" at location: ${targetDir}`
              );
              
              // Create the React app using reactAppGen
              reactAppGen(targetDir, message.name);
              
              // Show success message
              vscode.window.showInformationMessage(`Successfully created React app: ${message.name}`);
              
              // Open the created project folder
              openProjectFolder(targetDir, message.name);
            } catch (error) {
              vscode.window.showErrorMessage(`Failed to create app: ${error.message}`);
            }
          }
        },
        undefined,
        context.subscriptions,
      );
    },
  );

  context.subscriptions.push(disposable);
}

/**
 * Helper function to open a newly created project in VS Code
 * @param appTargetDirectory - The directory where the app was created
 * @param name - The name of the application
 */
function openProjectFolder(appTargetDirectory: string, name: string): void {
  try {
    const projectPath = path.join(appTargetDirectory, name);
    if (fs.existsSync(projectPath)) {
      vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath));
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to open project folder: ${error.message}`);
  }
}

function getWebviewContent(): string {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>React App Generator</title>
		<style>
			body {
				font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
				padding: 20px;
				color: var(--vscode-foreground);
				background-color: var(--vscode-editor-background);
			}
			.container {
				max-width: 500px;
				margin: 0 auto;
			}
			h2 {
				color: var(--vscode-editor-foreground);
				margin-bottom: 20px;
			}
			.form-group {
				margin-bottom: 15px;
			}
			label {
				display: block;
				margin-bottom: 5px;
				font-weight: bold;
			}
			input, select {
				width: 100%;
				padding: 8px;
				border: 1px solid var(--vscode-input-border);
				background-color: var(--vscode-input-background);
				color: var(--vscode-input-foreground);
				border-radius: 2px;
			}
			button {
				padding: 8px 16px;
				background-color: var(--vscode-button-background);
				color: var(--vscode-button-foreground);
				border: none;
				cursor: pointer;
				border-radius: 2px;
				margin-top: 10px;
			}
			button:hover {
				background-color: var(--vscode-button-hoverBackground);
			}
		</style>
	</head>
	<body>
		<div class="container">
			<h2>Generate React Application</h2>
			<form id="myForm">
				<div class="form-group">
					<label for="name">Project Name:</label>
					<input type="text" id="name" name="name" placeholder="my-react-app" required>
				</div>
				<div class="form-group">
					<label for="type">Template:</label>
					<select id="type" name="type" required>
						<option value="react">React</option>
						<option value="react-ts" selected>React + TypeScript</option>
						<option value="react-swc">React + SWC</option>
						<option value="react-swc-ts">React + SWC + TypeScript</option>
					</select>
				</div>
				<button type="submit">Generate Project</button>
			</form>
		</div>
		<script>
			const vscode = acquireVsCodeApi();
			document.getElementById('myForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const name = document.getElementById('name').value;
				const type = document.getElementById('type').value;
				vscode.postMessage({ command: 'submit', name, type });
			});
		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
