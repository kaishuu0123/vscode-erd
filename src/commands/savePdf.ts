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

    if (resource && resource.scheme !== 'file') {
        vscode
          .window
          .showErrorMessage('Please save to file before PDF export.');

        return;
    }

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
      })
      .then(undefined, err => {
          console.log(err);
      });
  }
}