import * as vscode from 'vscode';
import {join} from "path";

export var outputPanel = vscode
  .window
  .createOutputChannel("ERD");