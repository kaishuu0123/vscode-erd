import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { SaveCommand } from './save';
import { writeToFile } from '../writeToFile';

export class SavePngCommand extends SaveCommand implements Command {
  public readonly id = 'erd-preview.savePngPreview';

  public registerCommand(uri?: vscode.Uri) {
    const resource = uri || this.getActiveEditorUri();
    if (!resource) {
        return;
    }

    vscode.window
      .showSaveDialog({
          defaultUri: resource,
          filters: {
              Images: ["png"]
          }
      })
      .then(uri => {
          if (uri) {
              writeToFile(resource, uri.fsPath, 'png');
          }
      });
  }
}