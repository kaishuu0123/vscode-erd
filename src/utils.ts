import * as vscode from 'vscode';

// Utility functions.
export function getErdProgram(extensionId): string
{
    const configuration = vscode.workspace.getConfiguration(extensionId);
    const erdPath = configuration.get<string>("erdPath");

    if (erdPath === null || erdPath === undefined)
    {
        return "erd";
    }
    else
    {
        return erdPath;
    }
}

export function getDotProgram(extensionId): string
{
    const configuration = vscode.workspace.getConfiguration(extensionId);
    const dotPath = configuration.get<string>("dotPath");

    if (dotPath === null || dotPath === undefined)
    {
        return "dot";
    }
    else
    {
        return dotPath;
    }
}