import * as vscode from 'vscode';

import { Preview } from './preview';

export function isErdUri(uri: vscode.Uri) {
    return uri.path.endsWith('.erd');
}

export function isOutputPanel(uri: vscode.Uri) {
    return uri.toString().startsWith('output:extension-output-');
}

export class PreviewManager implements vscode.WebviewPanelSerializer {
    private static readonly erdPreviewFocusContextKey = 'erdPreviewFocus';

    private readonly _disposables: vscode.Disposable[] = [];
    private _previews: Preview[] = [];
    private _activePreview?: Preview;

    constructor(
        private readonly _extensionPath: string
    ) {
        vscode.workspace.onDidChangeTextDocument(this.onDidChangeTextDocument.bind(this), null, this._disposables);
        vscode.window.onDidChangeActiveTextEditor(this.onDidChangeActiveTextEditor.bind(this), null, this._disposables);

        // check the need to open auto preview on plugin activation,
        // as vscode.window.onDidChangeActiveTextEditor is not yet registered before the first .erd opened
        if (vscode.window.activeTextEditor && this.shouldAutoOpenPreviewForEditor(vscode.window.activeTextEditor)) {
            this.showPreview(vscode.window.activeTextEditor.document.uri, vscode.ViewColumn.Beside);
        }
    }

    public async showPreview(uri: vscode.Uri, viewColumn: vscode.ViewColumn) {
        const preview = this.getPreviewOnTargetColumn(viewColumn) || await this.createPreview(uri, viewColumn);
        preview.update(uri);
        preview.panel.reveal(preview.panel.viewColumn);
    }

    public showSource() {
        vscode.workspace.openTextDocument(this._activePreview!.source)
            .then(document => vscode.window.showTextDocument(document));
    }

    public async deserializeWebviewPanel(
        webview: vscode.WebviewPanel,
        state: any
    ): Promise<void> {
        const source = vscode.Uri.parse(state.uri);
        const preview = await Preview.revive(source, webview, this._extensionPath);
        this.registerPreview(preview);
        preview.update();
    }

    public dispose(): void {
        this._disposables.forEach(ds => ds.dispose());
        this._previews.forEach(ds => ds.dispose());
    }

    private isActivePreviewUri(uri: vscode.Uri) {
        return this._activePreview && this._activePreview.source.toString() === uri.toString();
    }

    private onDidChangeActiveTextEditor(editor?: vscode.TextEditor): void {
        if (!editor) { return; }

        if (!isOutputPanel(editor.document.uri) && !this.isActivePreviewUri(editor.document.uri)) {
            this._previews.forEach(preview => {
                preview.update(editor.document.uri);
            });
        }

        if (this.shouldAutoOpenPreviewForEditor(editor)) {
            this.showPreview(editor.document.uri, vscode.ViewColumn.Beside);
        }
    }

    private onDidChangeTextDocument(event: vscode.TextDocumentChangeEvent): void {
        const preview = this.getPreviewOf(event.document.uri);
        if (preview) {
            preview.update();
        }
    }

    private async createPreview(uri: vscode.Uri, viewColumn: vscode.ViewColumn): Promise<Preview> {
        const preview = await Preview.create(uri, viewColumn, this._extensionPath);
        this.registerPreview(preview);
        return preview;
    }

    private registerPreview(preview: Preview) {
        this._previews.push(preview);
        this.onPreviewFocus(preview);
        preview.onDispose(() => {
            this.onPreviewBlur();
            this._previews.splice(this._previews.indexOf(preview), 1);
        });

        preview.onDidChangeViewState(({ webviewPanel }) => {
            webviewPanel.active ? this.onPreviewFocus(preview) : this.onPreviewBlur();
        });
    }

    private onPreviewFocus(preview: Preview) {
        this._activePreview = preview;
        this.setErdPreviewFocusContext(true);
    }

    private onPreviewBlur() {
        this._activePreview = undefined;
        this.setErdPreviewFocusContext(false);
    }

    private setErdPreviewFocusContext(value: boolean) {
        vscode.commands.executeCommand('setContext', PreviewManager.erdPreviewFocusContextKey, value);
    }

    private getPreviewOnTargetColumn(viewColumn: vscode.ViewColumn): Preview | undefined {
        const activeViewColumn = vscode.window.activeTextEditor ?
            vscode.window.activeTextEditor.viewColumn : vscode.ViewColumn.Active;

        return viewColumn === vscode.ViewColumn.Active ?
            this._previews.find(preview => preview.panel.viewColumn === activeViewColumn) :
            this._previews.find(preview => preview.panel.viewColumn === <number>activeViewColumn + 1);
    }

    private getPreviewOf(resource: vscode.Uri): Preview | undefined {
        return this._previews.find(p => p.source.fsPath === resource.fsPath);
    }

    private shouldAutoOpenPreviewForEditor(editor: vscode.TextEditor) : boolean {
        const isAutoOpen = <boolean>vscode.workspace.getConfiguration('erd').get('preview.autoOpen');
        return isAutoOpen && !this.getPreviewOf(editor.document.uri);
    }
}