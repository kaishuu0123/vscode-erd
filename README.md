# ERD Preview

An extension for Visual Studio Code to preview ERD (Entity-relationship diagram) files.


[ERD Preview - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kaishuu0123.vscode-erd-preview#overview)

## Preview

![Preview](https://github.com/kaishuu0123/vscode-erd/raw/master/vscode-erd-demo.gif)

## Configuration

Make sure the extension can find the "erd" and "dot" program. <br/>
You can set `erd-preview.erdPath` and `erd-preview.dotPath` option. <br/>
Please edit settings.json. ([File] -> [Preference] -> [Settings])

## Requirements

Use this extension require `erd` and `dot` program.

You can get `erd` Program here.

* Single binary my project
    * https://github.com/kaishuu0123/erd-go/releases
* BurntSushi erd
    * https://github.com/BurntSushi/erd

You can get `dot` Program here.

* Single binary my project
    * https://github.com/kaishuu0123/graphviz-dot.js/releases
* Official Graphviz dot program
    * http://www.graphviz.org/download/

## Usage

Preview

1. write erd file ( example: https://github.com/kaishuu0123/erd-go/blob/master/examples/simple.er )
1. Press `Ctrl+Shift+p` (windows) or `Command+Shift+p` (Mac) and select `ERD: Preview Current Window"`

Export to file

1. Press `Ctrl+Shift+p` (windows) or `Command+Shift+p` (Mac) and select `ERD: Save as SVG` or `ERD: Save as PNG` or `ERD: Save as PDF`.

## Setup
### Windows

1. Download erd-go from https://github.com/kaishuu0123/erd-go/releases.
   * Destination directory Example
   * C:\Users\&lt;user name&gt;\Tools\windows_amd64_erd-go.exe
2. Download dot program from https://github.com/kaishuu0123/graphviz-dot.js/releases
   * Destination directory Example
   * C:\Users\&lt;user name&gt;\Tools\graphviz-dot-win-x64.exe
   * When you want to use png output
     * Install graphviz
     * https://www.graphviz.org
3. edit vscode settings.json
    ```json
    {
        "erd-preview.erdPath": "C:\\Users\\&lt;user name&gt;\\Tools\\windows_amd64_erd-go.exe",
        "erd-preview.dotPath": "C:\\Users\\&lt;user name&gt;\\Tools\\graphviz-dot-win-x64.exe",
    }
    ```
    * When uou want to use png output
      * Please search dot.exe program path.
      * ex.) C:\Program Files(x86)\Graphviz2.30\bin\dot.exe

### MacOSX

## Credits

This work is based off of several existing projects:

* https://github.com/qjebbs/vscode-plantuml
* https://github.com/vitaliymaz/vscode-svg-previewer

## Known Issues

* https://github.com/kaishuu0123/vscode-erd/issues

## Release Notes

-----------------------------------------------------------------------------------------------------------
