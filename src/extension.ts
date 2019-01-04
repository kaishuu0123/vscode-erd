'use strict';

import * as vscode from 'vscode';
import { outputPanel } from "./outputPanel";
import { CommandManager } from "./CommandManager";
import { ShowPreviewCommand, SaveSvgCommand, SavePdfCommand, SavePngCommand } from "./commands";
import { PreviewManager } from "./previews/previewManager";
import { ErdContentProvider } from "./erdContentProvider";

export function activate(context: vscode.ExtensionContext) {
    const contentProvider = new ErdContentProvider(context.extensionPath);
    context.subscriptions.push(
        vscode.workspace.registerTextDocumentContentProvider(
            'erd-preview',
            contentProvider
        )
    );

    outputPanel.append('erd-preview');

    const previewManager = new PreviewManager(context.extensionPath);
    vscode.window.registerWebviewPanelSerializer('erd-preview', previewManager);

    const commandManager = new CommandManager();
    commandManager.register(new ShowPreviewCommand(previewManager));
    commandManager.register(new SaveSvgCommand(previewManager));
    commandManager.register(new SavePdfCommand(previewManager));
    commandManager.register(new SavePngCommand(previewManager));
}

// this method is called when your extension is deactivated
export function deactivate() {
}