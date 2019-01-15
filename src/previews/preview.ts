import * as vscode from 'vscode';
import * as path from 'path';
import {outputPanel} from "../outputPanel";
import {getErdProgram, getDotProgram, getSourceText} from "../utils";
import * as child_process from "child_process";

export function withErdPreviewSchemaUri(uri : vscode.Uri) {
    return uri.with ({
        scheme: 'erd-preview',
        query: uri.toString()
    }) ;
    }

import {IMessage, updatePreview} from './webViewMessaging';

export class Preview {
    private static readonly contentProviderKey = 'erd-preview';

    private readonly _onDisposeEmitter = new vscode.EventEmitter < void > ();
    public readonly onDispose = this._onDisposeEmitter.event;

    private readonly _onDidChangeViewStateEmitter = new vscode.EventEmitter < vscode.WebviewPanelOnDidChangeViewStateEvent > ();
    public readonly onDidChangeViewState = this._onDidChangeViewStateEmitter.event;

    private _postponedMessage?: IMessage;

    public static async create(source : vscode.Uri, viewColumn : vscode.ViewColumn, extensionPath : string) {
        const panel = vscode
            .window
            .createWebviewPanel(Preview.contentProviderKey, Preview.getPreviewTitle(source.path), viewColumn, {enableScripts: true});
        const doc = await vscode
            .workspace
            .openTextDocument(withErdPreviewSchemaUri(source));
        panel.webview.html = doc.getText();
        return new Preview(source, panel, extensionPath);
    }

    public static async revive(source : vscode.Uri, panel : vscode.WebviewPanel, extensionPath : string) {
        const doc = await vscode
            .workspace
            .openTextDocument(withErdPreviewSchemaUri(source));
        panel.webview.html = doc.getText();
        return new Preview(source, panel, extensionPath);
    }

    private static getPreviewTitle(path : string) : string {
        return `Preview ${path.replace(/^.*[\\\/]/, '')}`;
    }

    constructor(private _resource : vscode.Uri, private _panel : vscode.WebviewPanel, private readonly _extensionPath : string,) {
        this.setPanelIcon();

        this
            ._panel
            .onDidChangeViewState((event : vscode.WebviewPanelOnDidChangeViewStateEvent) => {
                this
                    ._onDidChangeViewStateEmitter
                    .fire(event);

                if (event.webviewPanel.visible && this._postponedMessage) {
                    this.postMessage(this._postponedMessage);
                    delete this._postponedMessage;
                }
            });

        this
            ._panel
            .onDidDispose(() => {
                this
                    ._onDisposeEmitter
                    .fire();
                this.dispose();
            });
    }

    public get source() {
        return this._resource;
    }

    public get panel() : vscode.WebviewPanel {return this._panel;}

    public async update(resource?: vscode.Uri) {
        if (resource) {
            this._resource = resource;
        }
        this._panel.title = Preview.getPreviewTitle(this._resource.fsPath);

        const message = await this.getUpdateWebViewMessage(this._resource);
        this.postMessage(message);
    }

    public dispose() {
        this
            ._panel
            .dispose();
    }

    private postMessage(message : IMessage) : void {
        if(this._panel.visible) {
            this
                ._panel
                .webview
                .postMessage(message);
        } else {
            // It is not possible posting messages to hidden web views So saving the last
            // update and flush it once panel become visible
            this._postponedMessage = message;
        }
    }

    private async getUpdateWebViewMessage(uri : vscode.Uri) {
        const document = await vscode
            .workspace
            .openTextDocument(uri);
        const data = await this.convertToSvg(document.getText());

        return updatePreview({
            uri: uri.toString(),
            data: data
        });
    }

    private setPanelIcon() {
        const root = path.join(this._extensionPath, 'media');
    }

    private convertToSvg(erdContent : string) : Promise < string > {
        // TODO
        const dotProgram = getDotProgram('erd-preview');
        const erdProgram = getErdProgram('erd-preview');

        return new Promise < string > ((resolve, reject) => {
            outputPanel.clear();

            const erdProcess = child_process.spawn(erdProgram, ["-f", "dot"]);
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

            try {
                erdProcess
                    .stdin
                    .end(erdContent);
                erdProcess
                    .stdout
                    .pipe(dotProcess.stdin);

                // for Error handing
                let erdStdout = '';
                erdProcess
                    .stdout
                    .on('data', (data) => {
                        if (data.toString().length > 0) {
                            erdStdout += data.toString()
                        }
                    });
                erdProcess.on('close', (code) => {
                    if (code === 1) {
                        outputPanel.clear();
                        outputPanel.append(erdStdout);
                        let errorMessage = `
                            <tspan x="10" dy="1.2em">
                                ERD file parse error
                            </tspan>
                            <tspan x="10" dy="1.2em"></tspan>
                        `;
                        erdStdout
                            .split('\n')
                            .forEach((val) => {
                                errorMessage += `
                                <tspan x="10" dy="1.2em">
                                    ${this.escapeHtml(val)}
                                </tspan>`;
                            });
                        let svgText = `<svg class="textSVG" width="400pt" height="400pt" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" style='stroke-width: 0px; background-color: white;'>
                            <text font-size="15" x="0" y="10" fill="black">
                                ${errorMessage}
                            </text>
                        </svg>`;

                        dotProcess.stdin.end();
                        resolve(svgText);
                    }
                })

                let svgText = "";
                dotProcess
                    .stdout
                    .on('data', (data) => {
                        svgText += data.toString();
                    });

                dotProcess.on('close', (code) => {
                    if (code === 0) {
                        resolve(svgText);
                    }
                });
            } catch (error) {
                outputPanel.clear();
                outputPanel.append(error);

                erdProcess.kill('SIGKILL')
                dotProcess.kill('SIGKILL')

                reject(new Error(error));
            }
        });
    }

    private escapeHtml(unsafe) {
        return unsafe
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }
}