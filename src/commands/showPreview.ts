import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { ShowCommand } from './show';
import { PreviewManager } from '../previews/previewManager';

export class ShowPreviewCommand extends ShowCommand implements Command {
  public readonly id = 'erd-preview.showPreview';

  protected showPreview(webviewManager: PreviewManager, uri: vscode.Uri, viewColumn: vscode.ViewColumn): void {
    webviewManager.showPreview(uri, viewColumn);
  }

  public execute(uri?: vscode.Uri) {
    const resource = uri || this.getActiveEditorUri();
    if (resource) {
        this.showPreview(this.webviewManager, resource, vscode.ViewColumn.Beside);
    }
  }
}