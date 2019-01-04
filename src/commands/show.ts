import * as vscode from 'vscode';
import { PreviewManager } from '../previews/previewManager';

export class ShowCommand {
  public constructor(
    protected readonly webviewManager: PreviewManager
  ) { }

  protected showPreview(webviewManager: PreviewManager, uri: vscode.Uri, viewColumn: vscode.ViewColumn): void {
    webviewManager.showPreview(uri, viewColumn);
	}

  protected getActiveEditorUri(): vscode.Uri | undefined {
		return vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri;
	}
}