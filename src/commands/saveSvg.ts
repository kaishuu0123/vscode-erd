import * as vscode from 'vscode';
import { Command } from '../commandManager';
import { SaveCommand } from './save';
import { writeToFile } from '../writeToFile';

export class SaveSvgCommand extends SaveCommand implements Command {
  public readonly id = 'erd-preview.saveSvgPreview';

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
              Images: ["svg"]
          }
      })
      .then(uri => {
          if (uri) {
              writeToFile(resource, uri.fsPath, 'svg');
          }
      });
  }
}