// author: Aldrin Arabis (aldrinyarabis@gmail.com)
// date: 2023-06-05

const vscode = require("vscode");
const { exec } = require("child_process");
const EncryptProvider = require("./providers/encrypt-provider");
const DecryptProvider = require("./providers/decrypt-provider");
const path = require("path");
let registry = {};
let extPath = "";

const unsafeDecorationType = vscode.window.createTextEditorDecorationType({
  gutterIconPath: path.join(__filename, "..", "media", "lock-unsafe.png"),
  gutterIconSize: "cover",
  cursor: "hand",
});

/**
 * @param {string} cmd
 * @returns {Promise<string>}
 * @description Execute shell command
 * @see https://stackoverflow.com/a/64598488
 * @example
 * const out = await execShell('ls -al');
 * console.log(out);
 */
const execShell = (cmd) =>
  new Promise((resolve, reject) => {
    exec(cmd, (err, out) => {
      if (err) {
        return reject(err);
      }
      return resolve(out);
    });
  });

async function getSecureKey() {
  return await vscode.window.showInputBox({
    prompt: "Enter Secure Key",
    password: true,
  });
}

/**
 * @param {import("vscode").ExtensionContext} context
 * @param {String} action
 * @param {vscode.Range} range
 */
async function execAction(context, action, range) {
  // get document path
  const docPath = vscode.window.activeTextEditor.document.uri.fsPath;
  // get key from keyRegistry
  let key = registry[docPath].key;
  // if key is not found in keyRegistry, ask user to enter key
  if (!key) {
    key = registry[docPath].key = await getSecureKey();
    context.workspaceState.update("registry", registry);
  }

  // get algorithm, mode from setting
  const algorithm =
    registry[docPath].algorithm ||
    vscode.workspace.getConfiguration().get("mule-secure-properties.algorithm");
  const mode =
    registry[docPath].mode ||
    vscode.workspace.getConfiguration().get("mule-secure-properties.mode");

  // get value from range argument
  const editor = vscode.window.activeTextEditor;
  const txt = editor.document.getText(range);
  const prop = txt.split(/=(.*)/s);
  let value = prop[1];
  if (action === "decrypt") {
    // remove ![ and ] from decrypted value
    value = value.replace(/!\[|\]/g, "");
  }

  try {
    // execute secure properties tool
    let result = await execShell(
      `sh ${extPath}/lib/crypt-tool.sh ${action} ${algorithm} ${mode} ${key} "${value}"`
    );

    if (action === "encrypt") {
      // add ![ and ] to encrypted value
      result = `![${result}]`;
    }
    prop[1] = result.replace(/\n/g, "");
    // remove empty string at the end of array
    prop.pop();

    // replace value in editor
    editor.edit((edit) => edit.replace(range, prop.join("=")));
  } catch (e) {
    vscode.window.showErrorMessage(e.message);
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  registry = context.workspaceState.get("registry", {});

  const encryptProvider = new EncryptProvider();
  const decryptProvider = new DecryptProvider();

  extPath = context.extensionPath;

  ["encrypt", "decrypt"]
    .map((action) => {
      return vscode.commands.registerCommand(
        `mule-secure-properties.${action}`,
        (range) => {
          // if range is null, get current range on cursor
          if (range === null) {
            const editor = vscode.window.activeTextEditor;
            const selection = editor.selection;
            range = selection.active.line;
          }
          execAction(context, action, range);
        }
      );
    })
    .forEach((command) => context.subscriptions.push(command));

  // only active lense on secure properties file
  [encryptProvider, decryptProvider].map((provider) => {
    context.subscriptions.push(
      vscode.languages.registerCodeLensProvider(
        {
          scheme: "file",
          language: "properties",
          pattern: "**/*secure*.properties",
        },
        provider
      ),
      vscode.languages.registerCodeLensProvider(
        {
          scheme: "file",
          language: "java-properties",
          pattern: "**/*secure*.properties",
        },
        provider
      )
    );
  });

  //   update decoration on active editor change
  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor((editor) => {
      if (
        editor &&
        editor.document.languageId.includes("properties") &&
        editor.document.fileName.includes("secure")
      ) {
        updateDecorations(editor);
        ensureRegistry();
      }
    })
  );

  //   allow setting key by action
  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mule-secure-properties.setKey",
      async () => {
        const docPath = vscode.window.activeTextEditor.document.uri.fsPath;
        registry[docPath].key = await getSecureKey();
        context.workspaceState.update("keyRegistry", registry);
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mule-secure-properties.setAlgorithm",
      async () => {
        const docPath = vscode.window.activeTextEditor.document.uri.fsPath;
        const algorithm = await vscode.window.showQuickPick(
          ["AES", "Blowfish", "DES", "DESede", "RC2", "RCA"],
          {
            placeHolder: "Select Encryption Algorithm",
          }
        );
        registry[docPath].algorithm = algorithm;
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(
      "mule-secure-properties.setMode",
      async () => {
        const docPath = vscode.window.activeTextEditor.document.uri.fsPath;
        const mode = await vscode.window.showQuickPick(
          ["CBC", "CFB", "OFB", "ECB"],
          {
            placeHolder: "Select Encryption Mode",
          }
        );
        registry[docPath].mode = mode;
      }
    )
  );

  //   update decoration on text change
  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((event) => {
      if (
        active.document.languageId.includes("properties") &&
        event.document.fileName.includes("secure")
      ) {
        updateDecorations(vscode.window.activeTextEditor);
        ensureRegistry();
      }
    })
  );

  //   update decoration on current active editor on load
  const active = vscode.window.activeTextEditor;
  if (
    active.document.languageId.includes("properties") &&
    active.document.fileName.includes("secure")
  ) {
    updateDecorations(vscode.window.activeTextEditor);
    ensureRegistry();
  }
}

/**
 * @param {vscode.TextEditor} editor
 * @description Update decoration
 */
function updateDecorations(editor) {
  if (!editor.document.languageId.includes("properties")) return;
  // for each line, check if it contains ![ and ], if not add unsafe decoration
  const safeDecorations = [];
  const unsafeDecorations = [];
  for (let line = 0; line < editor.document.lineCount; line++) {
    const lineRange = editor.document.lineAt(line).range;
    const txt = editor.document.getText(lineRange);
    if (txt.trim() == "" || txt.startsWith("#")) continue;
    if (!txt.includes("=![")) {
      unsafeDecorations.push({ range: lineRange });
    }
  }
  editor.setDecorations(unsafeDecorationType, unsafeDecorations);
}

module.exports = {
  activate,
};

function ensureRegistry() {
  const docPath = vscode.window.activeTextEditor.document.uri.fsPath;
  registry[docPath] = registry[docPath] || {};
}
