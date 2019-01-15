import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { SaveCommand } from './save';
import { writeToFile } from '../writeToFile';

export class SavePdfCommand extends SaveCommand implements Command {
  public readonly id = 'erd-preview.savePdfPreview';

  public registerCommand(uri?: vscode.Uri) {
    const resource = uri || this.getActiveEditorUri();
    if (!resource) {
        return;
    }

    const activeTextEditor = vscode.window.activeTextEditor;

    vscode.window
      .showSaveDialog({
          defaultUri: resource,
          filters: {
              Images: ["pdf"]
          }
      })
      .then(uri => {
          if (uri) {
              writeToFile(resource, uri.fsPath, 'pdf');
          }
      });
  }
}