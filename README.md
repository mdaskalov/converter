# Data Format Converter Tool
Electron based tool to convert data from one format to another. 

Can currently only uncompress zipped data from base64 encoded source.

Uses [photonkit](http://photonkit.com) to look like a native macOS application.

The output can be pretty-printed in different formats (JSON, XML, CSS, SQL, etc.)

## Installation

To build and start the application clone it and do:

```
$ npm install
$ npm start
```

Native executables could be generated using [electron-builder](https://github.com/electron-userland/electron-builder):

```
$ node_modules/.bin/electron-builder 
```
