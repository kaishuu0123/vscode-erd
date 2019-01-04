import * as vscode from 'vscode';
import { PreviewManager } from '../previews/previewManager';

export class SaveCommand {
  public constructor(
    protected readonly webviewManager: PreviewManager
  ) { }

  protected getActiveEditorUri(): vscode.Uri | undefined {
		return vscode.window.activeTextEditor && vscode.window.activeTextEditor.document.uri;
	}
}