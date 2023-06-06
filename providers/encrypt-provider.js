const vscode = require("vscode");

class EncryptProvider {
    /**
     * 
     * @param {import("vscode").TextDocument} document 
     * @param {import("vscode").CancellationToken} token 
     * @returns CodeLens[]
     */
    provideCodeLenses(document, token) {
        const codeLenses = [];

        for (let line = 0; line < document.lineCount; line++) {
            const lineRange = document.lineAt(line).range;

            if (document.getText(lineRange).startsWith("#") || lineRange.isEmpty) {
                continue;
            }

            const txt = document.getText(lineRange);
            const regex = /.+=(\w.*)/;
            const matches = regex.exec(txt);

            if (matches === null) {
                continue;
            }

            const codeLens = new vscode.CodeLens(lineRange, {
                title: `Encrypt`,
                command: 'mule-secure-properties.encrypt',
                arguments: [lineRange],
            });

            codeLenses.push(codeLens);
        }

        return codeLenses;
    }

    resolveCodeLens(codeLens, token) {
        return codeLens;
    }
}

module.exports = EncryptProvider;
