const vscode = require("vscode");

class DecryptProvider {
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

            const text = document.getText(lineRange);
            if (text.startsWith("#") || lineRange.isEmpty) {
                continue;
            }

            const txt = document.getText(lineRange);
            const regex = /.+=!\[.*\]/;
            const matches = regex.exec(txt);

            if (matches === null) {
                continue;
            }

            const codeLens = new vscode.CodeLens(lineRange, {
                title: `Decrypt`,
                command: 'mule-secure-properties.decrypt',
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

module.exports = DecryptProvider;
