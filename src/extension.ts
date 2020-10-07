import * as vscode from 'vscode';
import { CommandManager } from "./commandManager";
import { ShowPreviewCommand, SaveSvgCommand, SavePdfCommand, SavePngCommand } from "./commands";
import { PreviewManager } from "./previews/previewManager";

export function activate(context: vscode.ExtensionContext) {
    const previewManager = new PreviewManager(context.extensionPath);
    vscode.window.registerWebviewPanelSerializer('erd-preview', previewManager);

    const commandManager = new CommandManager();
    context.subscriptions.push(commandManager);
    commandManager.register(new ShowPreviewCommand(previewManager));
    commandManager.register(new SaveSvgCommand(previewManager));
    commandManager.register(new SavePdfCommand(previewManager));
    commandManager.register(new SavePngCommand(previewManager));
}

// this method is called when your extension is deactivated
export function deactivate() {
}