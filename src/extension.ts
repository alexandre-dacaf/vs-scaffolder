import * as vscode from 'vscode';
import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

// Function to recursively create directories and files
function createStructure(template: any, basePath: string) {
    for (const key in template) {
        const fullPath = path.join(basePath, key);

        if (typeof template[key] === 'object') {
            // Create directory only if it doesn't exist
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath);
            }
            // Recursively create substructure
            createStructure(template[key], fullPath);
        } else if (typeof template[key] === 'string') {
            // Overwrite the file even if it already exists
            fs.writeFileSync(fullPath, template[key]);
        }
    }
}

// Extension activation function
export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('vsScaffolder.createStructure', async () => {
        // Ask the user to select a YAML template file
        const templatePath = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            filters: { 'YAML Files': ['yaml', 'yml'] }
        });

        if (!templatePath) return;

        // Read and parse the YAML template file
        const templateContent = fs.readFileSync(templatePath[0].fsPath, 'utf-8');
        const template = yaml.load(templateContent);

        // Get the root directory of the current workspace
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No project folder is open.');
            return;
        }

        // Create the project structure
        createStructure(template, workspaceFolder);

        vscode.window.showInformationMessage('Project structure created successfully!');
    });

    context.subscriptions.push(disposable);
}

// Optional deactivation function
export function deactivate() {}
