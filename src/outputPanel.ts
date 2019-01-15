import * as vscode from 'vscode';
import {join} from "path";

export let outputPanel = vscode
  .window
  .createOutputChannel("ERD");