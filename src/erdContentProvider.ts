import * as path from 'path';
import * as vscode from 'vscode';
import * as fs from 'fs';
import { contextManager } from './contextManager';

export class ErdContentProvider implements vscode.TextDocumentContentProvider {

    constructor(
        private readonly _extensionPath: string
    ) {}

    public provideTextDocumentContent(uri: vscode.Uri): Thenable<string> {
        const source = vscode.Uri.parse(uri.query);
        return vscode.workspace.openTextDocument(source)
            .then(document => this.getHtml(document, source));
    }

    private getHtml(document: vscode.TextDocument, resource: vscode.Uri) {
        const base = `<base href="${this.getBaseUrl()}">`;
        const css = `<link rel="stylesheet" type="text/css" href="vscode-resource:css/styles.css">`;
        const scripts = `<script type="text/javascript" src="vscode-resource:js/index.js"></script>`;
        return `<!DOCTYPE html><html><head>${base}${css}</head><body>${scripts}<div id="erd-svg"></div></body></html>`;
    }

    private getBaseUrl() {
        const templatePath = vscode.Uri.file(path.join(this._extensionPath, 'dist', '/'));
        return templatePath.with({ scheme: 'vscode-resource' }).toString();
    }
}