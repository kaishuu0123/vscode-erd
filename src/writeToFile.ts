import * as vscode from 'vscode';
import {writeFileSync} from "fs";
import * as child_process from "child_process";
import * as fs from 'fs';
import {getErdProgram, getDotProgram, getSourceText} from "./utils";
import {outputPanel} from "./outputPanel";
import {extensionId} from "./consts";

export const writeToFile = async function (uri, fileName, fileFormat) {
    const sourceText = await getSourceText(uri)
    const dotProgram = getDotProgram(extensionId);
    const erdProgram = getErdProgram(extensionId);

    const erdProcess = child_process.spawn(erdProgram, ["-f", "dot"]);
    const dotProcess = child_process.spawn(dotProgram, ["-T", fileFormat]);
    // dotProcess
    //     .stdout
    //     .setEncoding('binary')

    let errorHandler = (commandName, error) => {
        const codeProperty = "code";

        if (error[codeProperty] === "ENOENT") {
            vscode
                .window
                .showErrorMessage(`File not found: ${commandName} command`);
        } else {
            vscode
                .window
                .showErrorMessage(error.message);
        }
    };

    erdProcess.on('error', (error) => errorHandler('erd', error))
    dotProcess.on('error', (error) => errorHandler('dot', error));

    try {
        erdProcess
            .stdin
            .end(sourceText);
        erdProcess
            .stdout
            .pipe(dotProcess.stdin);

        // for Error handing
        let erdStdout = '';
        erdProcess
            .stdout
            .on('data', (data) => {
                if (data.toString().length > 0) {
                    erdStdout += data.toString()
                }
            });
        erdProcess.on('close', (code) => {
            if (code === 1) {
                outputPanel.clear();
                outputPanel.append(erdStdout);
                dotProcess
                    .stdin
                    .end();
                vscode
                    .window
                    .showErrorMessage(erdStdout);
            }
        })

        let svgText = "";
        const wstream = fs.createWriteStream(fileName, {encoding: 'binary'});
        dotProcess
            .stdout
            .on('data', (data) => {
                if (fileFormat === 'svg') {
                    svgText += data.toString();
                } else {
                    wstream.write(data)
                }
            });

        dotProcess.on('close', (code) => {
            if (code === 0) {
                if (fileFormat === 'svg') {
                    var result = writeFileSync(fileName, svgText, {encoding: null});
                } else {
                    wstream.end()
                }
                vscode
                    .window
                    .showInformationMessage(`SVG file saved as ${fileName}`);
            } else {
                vscode
                    .window
                    .showErrorMessage(`Error: code ${code}. Please check ERD preview.`);
            }
        });
    } catch (error) {
        erdProcess.kill('SIGKILL')
        dotProcess.kill('SIGKILL')

        vscode
            .window
            .showErrorMessage(error);
    }
};
