'use strict';

import * as child_process from "child_process";
import * as path from "path";
import * as vscode from 'vscode';
import * as fs from 'fs';
import { outputPanel } from "./outputPanel";
import { contextManager } from "./contextManager";
import { getErdProgram, getDotProgram, getSourceUri, getSourceText } from "./utils";
import { writeFileSync } from "fs";
import { homedir } from "os";

const extensionId = "erd-preview";
const previewCommand = "erd-preview.showPreview";
const saveCommand = "erd-preview.savePreview";
const previewScheme = "erd-preview";

function getErdPreviewUri(sourceUri: vscode.Uri) {
    return vscode.Uri.parse(`${previewScheme}://preview/?${sourceUri.toString(true)}`)
}

function getPreviewColumn(editor: vscode.TextEditor) {
    switch (editor.viewColumn) {
    case vscode.ViewColumn.One:
        return vscode.ViewColumn.Two;
    default:
        return vscode.ViewColumn.Three;
    }
}

async function writeTofile(uri, fileName) {
    let WindowP = vscode.window.activeTextEditor;

    const sourceText = await getSourceText(uri)
    const dotProgram = getDotProgram(extensionId);
    const erdProgram = getErdProgram(extensionId);

    const erdProcess = child_process.spawn(erdProgram);
    const dotProcess = child_process.spawn(dotProgram, ["-T", "svg"]);

    let errorHandler = (commandName, error) => {
        const codeProperty = "code";

        if (error[codeProperty] === "ENOENT"){
            vscode.window.showErrorMessage(`File not found: ${commandName} command`);
        } else {
            vscode.window.showErrorMessage(error.message);
        }
    };

    erdProcess.on('error', (error) => errorHandler('erd', error))
    dotProcess.on('error', (error) => errorHandler('dot', error));

    try {
        erdProcess.stdin.end(sourceText);
        erdProcess.stdout.pipe(dotProcess.stdin);

        // for Error handing
        let erdStdout = '';
        erdProcess.stdout.on('data', (data) => {
            if (data.toString().length > 0) {
                erdStdout += data.toString()
            }
        });
        erdProcess.on('exit', (code, signal) => {
            if (code === 1) {
                outputPanel.clear();
                outputPanel.append(erdStdout);
                vscode.window.showErrorMessage(erdStdout);
            }
        })

        let svgText = "";
        dotProcess.stdout.on('data', (data) => {
            svgText += data.toString();
        });

        dotProcess.stdout.on('end', () => {
            var result = writeFileSync(fileName, svgText);
            vscode.window.showInformationMessage(`SVG file saved as ${fileName}`);
        });
    } catch (error) {
        vscode.window.showErrorMessage(error);
    }
};

class ErdPreviewContentProvider implements vscode.TextDocumentContentProvider
{
    private onDidChangeEventEmitter = new vscode.EventEmitter<vscode.Uri>();
    private template: string;
    private templateProcessing: string;

    public get onDidChange(): vscode.Event<vscode.Uri> {
        return this.onDidChangeEventEmitter.event;
    }

    public async provideTextDocumentContent(uri: vscode.Uri, token: vscode.CancellationToken): Promise<string> {
        const sourceText = await getSourceText(uri);
        const dotProgram = getDotProgram(extensionId);
        const erdProgram = getErdProgram(extensionId);
        let tplPreviewPath: string = path.join(contextManager.context.extensionPath, "templates", "preview.html");
        this.template = '`' + fs.readFileSync(tplPreviewPath, "utf-8") + '`';

        return new Promise<string>((resolve, reject) => {
            outputPanel.clear();

            const erdProcess = child_process.spawn(erdProgram);
            const dotProcess = child_process.spawn(dotProgram, ["-T", "svg"]);

            let errorHandler = (commandName, error) => {
                const codeProperty = "code";

                if (error[codeProperty] === "ENOENT") {
                    outputPanel.clear();
                    outputPanel.append(`File not found: ${commandName} command`);
                    reject(new Error(`File not found: ${commandName} command`));
                } else {
                    outputPanel.clear();
                    outputPanel.append(error.message);
                    reject(new Error(error.message));
                }
            };

            erdProcess.on('error', (error) => errorHandler('erd', error))
            dotProcess.on('error', (error) => errorHandler('dot', error));

            token.onCancellationRequested((_) => {
                try {
                    erdProcess.kill();
                    dotProcess.kill();
                } catch (error) {
                    outputPanel.clear();
                    outputPanel.append(error);
                    reject(new Error(error));
                }
            });

            try {
                erdProcess.stdin.end(sourceText);
                erdProcess.stdout.pipe(dotProcess.stdin);

                // for Error handing
                let erdStdout = '';
                erdProcess.stdout.on('data', (data) => {
                    if (data.toString().length > 0) {
                        erdStdout += data.toString()
                    }
                });
                erdProcess.on('exit', (code, signal) => {
                    if (code === 1) {
                        outputPanel.clear();
                        outputPanel.append(erdStdout);
                        let svgText = `
                        <pre style="background-color: white; color: red;"><code>Syntax Error: \n ${erdStdout}</code></pre>
                        `;
                        resolve(eval(this.template));
                    }
                })

                let svgText = "";
                dotProcess.stdout.on('data', (data) => {
                    svgText += data.toString();
                });

                dotProcess.stdout.on('end', () => {
                    resolve(eval(this.template));
                });
            } catch (error) {
                outputPanel.clear();
                outputPanel.append(error);
                reject(new Error(error));
            }
        });
    }

    public updatePreview(sourceUri: vscode.Uri)
    {
        this.onDidChangeEventEmitter.fire(getErdPreviewUri(sourceUri));
    }
}

export function activate(context: vscode.ExtensionContext) {
    contextManager.set(context);

    let fileName = vscode.window.activeTextEditor.document.fileName.split("/").slice(-1)[0].replace(".js",".svg").toString();
    let dirName = path.dirname(vscode.window.activeTextEditor.document.fileName).toString();
    let lastUsedImageUri = vscode.Uri.file(
        path.resolve(homedir(), dirName + "/" + fileName)
    );

    context.subscriptions.push(vscode.commands.registerCommand(saveCommand, () => {
        const activeTextEditor = vscode.window.activeTextEditor;

        vscode.window
            .showSaveDialog({
                defaultUri: lastUsedImageUri,
                filters: {
                    Images: ["svg"]
                }
            })
            .then(uri => {
                if (uri) {
                    writeTofile(getErdPreviewUri(activeTextEditor.document.uri), uri.fsPath);
                    lastUsedImageUri = uri;
                }
            });
    }));

    const previewContentProvider = new ErdPreviewContentProvider();

    context.subscriptions.push(vscode.workspace.registerTextDocumentContentProvider(previewScheme,
        previewContentProvider));

    context.subscriptions.push(vscode.commands.registerCommand(previewCommand, () =>
    {
        const activeTextEditor = vscode.window.activeTextEditor;

        return vscode.commands.executeCommand("vscode.previewHtml",
            getErdPreviewUri(activeTextEditor.document.uri),
            getPreviewColumn(activeTextEditor),
            `Preview '${path.basename(activeTextEditor.document.uri.fsPath)}'`,
            { allowScripts: true, allowSvgs: true });
    }));

    context.subscriptions.push(vscode.workspace.onDidChangeTextDocument((e) =>
    {
        previewContentProvider.updatePreview(e.document.uri);
    }));
}

// this method is called when your extension is deactivated
export function deactivate() {
}