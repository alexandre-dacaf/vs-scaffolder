# **VS Scaffolder**

The **VS Scaffolder** extension allows you to quickly generate and scaffold project structures based on **YAML templates**.

---

## **Features**

- Recursively creates directories and files from a YAML template.
- Overwrites existing files but preserves existing directories.
- Works seamlessly with both small and complex nested project structures.
- Command integration:
  - **"VS Scaffolder: Create Project Structure"** (available in the Command Palette).

---

## **Usage**

1. Press **`Ctrl + Shift + P`** (or `Cmd + Shift + P` on macOS) to open the Command Palette.
2. Run the command **"VS Scaffolder: Create Project Structure"**.
3. Select a YAML template file.
4. The extension generates the project structure in the root of your workspace.

---

## **Example YAML Template**

```yaml
src:
    controllers:
        userController.ts: |
            // User controller logic
            export function getUser() {
                console.log('Fetching user data...');
            }
    services:
        userService.ts: |
            // Service logic
            export function fetchData() {
                return { name: 'Test User' };
            }
README.md: |
    # Project Documentation
    Generated with VS Scaffolder.
.gitignore: |
    node_modules/
    dist/
```

---

## **Extension Settings**

No custom settings are required.

---

## **Release Notes**

### **1.0.0**
- Initial release with YAML template support.
- Supports recursive directory and file creation.

---

## **License**

MIT License. See the [LICENSE](LICENSE) file for more details.
