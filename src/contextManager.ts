import * as vscode from 'vscode';

class ContextManager {
    private _ctx : vscode.ExtensionContext;
    private _listeners : ((ctx : vscode.ExtensionContext) => void)[] = [];
    private _previewStatus : string;

    set(ctx : vscode.ExtensionContext) {
        this._ctx = ctx;
        for (let callback of this._listeners) {
            callback(ctx);
        }
    }
    addInitiatedListener(listener : (ctx : vscode.ExtensionContext) => void) : void {
        this
            ._listeners
            .push(listener);
    }
    get context() {
        return this._ctx
    }
    setPreviewStatus(previewStatus: string) {
        this._previewStatus = previewStatus;
    }
    get previewStatus() {
        return this._previewStatus;
    }
}

export var contextManager = new ContextManager();