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

    if (resource && resource.scheme !== 'file') {
        vscode
          .window
          .showErrorMessage('Please save to file before PNG export.');

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
      })
      .then(undefined, err => {
          console.log(err);
      });
  }
}