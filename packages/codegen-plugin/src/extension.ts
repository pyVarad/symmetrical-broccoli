// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

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
    () => {
      // Create and show a new webview panel
      const panel = vscode.window.createWebviewPanel(
        "formApp",
        "Simple Form App",
        vscode.ViewColumn.One,
        {
          enableScripts: true,
        },
      );

      // Set the webview's HTML content
      panel.webview.html = getWebviewContent();

      // Handle messages from the webview
      panel.webview.onDidReceiveMessage(
        (message) => {
          if (message.command === "submit") {
            vscode.window.showInformationMessage(
              `Form submitted! Name: ${message.name}, Email: ${message.email}`,
            );
          }
        },
        undefined,
        context.subscriptions,
      );
    },
  );

  context.subscriptions.push(disposable);
}

function getWebviewContent(): string {
  return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Simple Form App</title>
	</head>
	<body>
		<h2>Simple Form</h2>
		<form id="myForm">
			<label for="name">Name:</label><br>
			<input type="text" id="name" name="name" required><br><br>
			<label for="email">Email:</label><br>
			<input type="email" id="email" name="email" required><br><br>
			<input type="submit" value="Submit">
		</form>
		<script>
			const vscode = acquireVsCodeApi();
			document.getElementById('myForm').addEventListener('submit', function(event) {
				event.preventDefault();
				const name = document.getElementById('name').value;
				const email = document.getElementById('email').value;
				vscode.postMessage({ command: 'submit', name, email });
			});
		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
