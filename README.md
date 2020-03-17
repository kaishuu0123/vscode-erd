# ERD Preview

<p align="center">
  <a href="https://marketplace.visualstudio.com/items?itemName=kaishuu0123.vscode-erd-preview">
    <img src="https://vsmarketplacebadge.apphb.com/version-short/kaishuu0123.vscode-erd-preview.svg">
  </a>
  <a href="https://marketplace.visualstudio.com/items?itemName=kaishuu0123.vscode-erd-preview">
    <img src="https://vsmarketplacebadge.apphb.com/downloads-short/kaishuu0123.vscode-erd-preview.svg">
  </a>
</p>

An extension for Visual Studio Code to preview ERD (Entity-relationship diagram) files.


[ERD Preview - Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=kaishuu0123.vscode-erd-preview#overview)

[github.com/kaishuu0123/vscode-erd](https://github.com/kaishuu0123/vscode-erd/)

## Preview

![Preview](https://github.com/kaishuu0123/vscode-erd/raw/master/vscode-erd-demo.gif)

## Configuration

Make sure the extension can find the "erd" and "dot" program. <br/>
You can set `erd-preview.erdPath` and `erd-preview.dotPath` option. <br/>
Please edit settings.json. ([File] -> [Preference] -> [Settings])

## Requirements

Use this extension require `erd` and `dot` command.

You can get `erd` command here.

* Single binary my project
    * https://github.com/kaishuu0123/erd-go/releases
* BurntSushi erd
    * https://github.com/BurntSushi/erd

You can get `dot` command here.

* Single binary my project
    * https://github.com/kaishuu0123/graphviz-dot.js/releases
* Official Graphviz dot command
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
   * `C:\Users\(user name)\Tools\windows_amd64_erd-go.exe`
2. Download dot program from https://github.com/kaishuu0123/graphviz-dot.js/releases
   * Destination directory Example
   * `C:\Users\(user name)\Tools\graphviz-dot-win-x64.exe`
   * When you want to use png output
     * Install graphviz
     * https://www.graphviz.org
3. edit vscode settings.json
    ```json
    {
        "erd-preview.erdPath": "C:\\Users\\(user name)\\Tools\\windows_amd64_erd-go.exe",
        "erd-preview.dotPath": "C:\\Users\\(user name)\\Tools\\graphviz-dot-win-x64.exe",
    }
    ```
    * When uou want to use png output
      * Please search dot.exe program path.
      * ex.) C:\Program Files(x86)\Graphviz2.30\bin\dot.exe

### MacOSX
#### Use binary

1. Download erd-go from https://github.com/kaishuu0123/erd-go/releases.
   * Destination directory Example
   * `/Users/(user name)/tools/darwin_amd64_erd-go`
2. Download dot program from https://github.com/kaishuu0123/graphviz-dot.js/releases
   * Destination directory Example
   * `/Users/(user name)/tools/graphviz-dot-macos-x64`
   * When you want to use png output
     * Install graphviz
     * https://www.graphviz.org
3. edit vscode settings.json
    ```json
    {
        "erd-preview.erdPath": "/Users/(user name)/tools/darwin_amd64_erd-go",
        "erd-preview.dotPath": "/Users/(user name)/tools/graphviz-dot-macos-x64",
    }
    ```
    * When uou want to use png output
      * Please search dot command path.

#### Use homebrew
1. Install erd-go from homebrew
   ```shell
   $ brew tap kaishuu0123/erd-go
   $ brew install erd-go

   # install check
   $ erd-go
   ```
2. Install dot program(graphviz) from homebrew
   ```shell
   $ brew install graphviz

   # install check
   $ dot
   ```
3. Install this extention to Visutal Studio Code.

### Linux

1. Download erd-go from https://github.com/kaishuu0123/erd-go/releases.
   * Destination directory Example
   * `/home/(user name)/tools/linux_amd64_erd-go`
2. Download dot program from https://github.com/kaishuu0123/graphviz-dot.js/releases
   * Destination directory Example
   * `/Users/(user name)/tools/graphviz-dot-linux-x64`
   * When you want to use png output
     * Install graphviz
     * https://www.graphviz.org
3. edit vscode settings.json
    ```json
    {
        "erd-preview.erdPath": "/home/(user name)/tools/linux_amd64_erd-go",
        "erd-preview.dotPath": "/Users/(user name)/tools/graphviz-dot-linux-x64",
    }
    ```
    * When uou want to use png output
      * Please search `dot` command path.

## Development

* Clone this repo.

```
$ git clone git@github.com:kaishuu0123/vscode-erd.git
```

* Open by vscode

```
$ cd vscode-erd
$ code .
```

* Press F5 Key

## Credits

This work is based off of several existing projects:

* https://github.com/qjebbs/vscode-plantuml
* https://github.com/vitaliymaz/vscode-svg-previewer

## Known Issues

* https://github.com/kaishuu0123/vscode-erd/issues

## Release Notes

* https://github.com/kaishuu0123/vscode-erd/releases

