import * as vscode from "vscode";
import * as fs from "fs";
import * as path from "path";
import * as yaml from "js-yaml";

// Function to recursively create directories and files
function createStructure(template: any, basePath: string) {
    for (const key in template) {
        const fullPath = path.join(basePath, key);

        if (typeof template[key] === "object") {
            // Create directory only if it doesn't exist
            if (!fs.existsSync(fullPath)) {
                fs.mkdirSync(fullPath);
            }
            // Recursively create substructure
            createStructure(template[key], fullPath);
        } else if (typeof template[key] === "string") {
            // Overwrite the file even if it already exists
            fs.writeFileSync(fullPath, template[key]);
        }
    }
}

function getDirectoryStructure(dirPath: string): any {
    const result: any = {};

    const entries = fs.readdirSync(dirPath, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            // Recursively process subdirectories
            result[entry.name] = getDirectoryStructure(fullPath);
        } else if (entry.isFile()) {
            // Read file content (or just use an empty string)
            const content = fs.readFileSync(fullPath, "utf-8");
            result[entry.name] = content || "";
        }
    }

    return result;
}

// Command to generate YAML from a directory
async function generateYamlFromDirectory() {
    // Ask the user to select a directory (or use the workspace root)
    const selectedFolderUri = await vscode.window.showOpenDialog({
        canSelectFiles: false,
        canSelectFolders: true,
        canSelectMany: false,
        openLabel: "Select Directory",
    });

    const targetDir =
        selectedFolderUri?.[0]?.fsPath || vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    if (!targetDir) {
        vscode.window.showErrorMessage("No directory selected.");
        return;
    }

    // Generate the directory structure as YAML
    const structure = getDirectoryStructure(targetDir);
    const yamlContent = yaml.dump(structure);

    // Save the YAML file
    const yamlFilePath = path.join(targetDir, "template.yaml");
    fs.writeFileSync(yamlFilePath, yamlContent);

    vscode.window.showInformationMessage(`YAML template generated at: ${yamlFilePath}`);
}

// Extension activation function
export function activate(context: vscode.ExtensionContext) {
    let createStructureCmd = vscode.commands.registerCommand(
        "vsScaffolder.createStructure",
        async () => {
            // Ask the user to select a YAML template file
            const templatePath = await vscode.window.showOpenDialog({
                canSelectFiles: true,
                filters: { "YAML Files": ["yaml", "yml"] },
            });

            if (!templatePath) return;

            // Read and parse the YAML template file
            const templateContent = fs.readFileSync(templatePath[0].fsPath, "utf-8");
            const template = yaml.load(templateContent);

            // Get the root directory of the current workspace
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0].uri.fsPath;
            if (!workspaceFolder) {
                vscode.window.showErrorMessage("No project folder is open.");
                return;
            }

            // Create the project structure
            createStructure(template, workspaceFolder);

            vscode.window.showInformationMessage("Project structure created successfully!");
        }
    );

    let generateYamlCmd = vscode.commands.registerCommand(
        "vsScaffolder.generateYamlFromDirectory",
        async () => {
            await generateYamlFromDirectory();
        }
    );

    context.subscriptions.push(createStructureCmd, generateYamlCmd);
}

// Optional deactivation function
export function deactivate() {}
