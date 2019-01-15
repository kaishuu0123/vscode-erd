import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { ShowCommand } from './show';

export class ShowPreviewCommand extends ShowCommand implements Command {
  public readonly id = 'erd-preview.showPreview';

  public registerCommand(uri?: vscode.Uri) {
    const resource = uri || this.getActiveEditorUri();
    if (resource) {
        this.showPreview(this.webviewManager, resource, vscode.ViewColumn.Beside);
    }
  }
}