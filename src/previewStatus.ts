import { commands, Disposable } from 'vscode';
import { contextManager } from './contextManager';

export abstract class Command extends Disposable {

    private _disposable: Disposable;

    constructor(protected command: string) {
        super(() => this.dispose());
        this._disposable = commands.registerCommand(command, this.execute, this);
    }

    dispose() {
        this._disposable && this._disposable.dispose();
    }

    abstract execute(...args: any[]): any;

}

export class CommandPreviewStatus extends Command {
  private _setUIStatus: string;
  execute(...args: any[]) {
    contextManager.setPreviewStatus(JSON.stringify(args[0]));
  }
  constructor() {
    super("erd-preview.previewStatus");
    this._setUIStatus = '';
  }
}