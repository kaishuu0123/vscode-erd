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
        const css = `<link rel="stylesheet" type="text/css" href="vscode-resource:styles.css">`;
        const scripts = `<script type="text/javascript" src="vscode-resource:index.js"></script>`;
        const custom = `
        <script>
        // Handle the message inside the webview
        window.addEventListener('message', event => {
            const erdSvg = document.getElementById('erd-svg');

            const message = event.data; // The JSON data our extension sent

            switch (message.command) {
                case 'source:update':
                    const vscode = acquireVsCodeApi();
                    vscode.setState({
                        uri: message.payload.uri
                    })
                    erdSvg.innerHTML = message.payload.data;
                    break;
            }
        });
    </script>
        `
        return `<!DOCTYPE html><html><head>${base}${css}</head><body>${scripts}${custom}<div id="erd-svg"></div></body></html>`;
    }

    private getBaseUrl() {
        const templatePath = vscode.Uri.file(path.join(this._extensionPath, 'template', '/'));
        return templatePath.with({ scheme: 'vscode-resource' }).toString();
    }
}