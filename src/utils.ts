import * as child_process from "child_process";
import * as vscode from 'vscode';
import {writeFileSync} from "fs";

// Utility functions.
export function getErdProgram(extensionId) : string {
    const configuration = vscode
        .workspace
        .getConfiguration(extensionId);
    const erdPath = configuration.get < string > ("erdPath");

    if (erdPath === null || erdPath === undefined) {
        return "erd";
    } else {
        return erdPath;
    }
}

export function getDotProgram(extensionId) : string {
    const configuration = vscode
        .workspace
        .getConfiguration(extensionId);
    const dotPath = configuration.get < string > ("dotPath");

    if (dotPath === null || dotPath === undefined) {
        return "dot";
    } else {
        return dotPath;
    }
}

export function getSourceUri(previewUri : vscode.Uri) : vscode.Uri {
    return vscode
        .Uri
        .parse(previewUri.query);
}

export async function getSourceText(uri) {
    const sourceUri = uri;
    const sourceDocument = await vscode
        .workspace
        .openTextDocument(sourceUri);
    const sourceText = sourceDocument.getText();
    return sourceText;
}