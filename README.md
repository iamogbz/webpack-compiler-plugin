# Webpack Compiler Plugin

[![Build Status](https://travis-ci.org/iamogbz/webpack-compiler-plugin.svg?branch=master)](https://travis-ci.org/iamogbz/webpack-compiler-plugin)
[![Coverage Status](https://coveralls.io/repos/github/iamogbz/webpack-compiler-plugin/badge.svg?branch=master)](https://coveralls.io/github/iamogbz/webpack-compiler-plugin?branch=master)
[![npm version](https://badge.fury.io/js/webpack-compiler-plugin.svg)](https://badge.fury.io/js/webpack-compiler-plugin)
[![Dependencies](https://david-dm.org/iamogbz/webpack-compiler-plugin/status.svg)](https://github.com/iamogbz/webpack-compiler-plugin)
[![Dependabot badge](https://badgen.net/dependabot/iamogbz/crx-livereload/?icon=dependabot)](https://app.dependabot.com)

Easily listen to `webpack` compiler hooks and execute commands on events.

## API

This plugin runs your specified commands at keys stages in the `webpack` build process.

### `buildStart`

This is run only once when the `webpack` build is first started, just after plugin are loaded.

See [webpack.compiler.hook.afterPlugins](https://webpack.js.org/api/compiler-hooks/#afterplugins).

### `compileStart`

This is run every time `webpack` starts compiling the source code, can be run multiple times when using the `--watch` flag.

See [webpack.compiler.hook.compilation](https://webpack.js.org/api/compiler-hooks/#compilation).

### `compileEnd`

This is run every time `webpack` finishes compiling the source code, just after the code is emitted.

See [webpack.compiler.hook.done](https://webpack.js.org/api/compiler-hooks/#done).

### `buildEnd`

This is the last stage run only when the build process is exiting. Is also triggered when exiting is caused by a build failure, interrupt signal, etc.

See [node.process.exit](https://nodejs.org/api/process.html#process_event_exit).

## Example

```js
/* webpack.config.js */

const { execSync } = require("child_process");
const { WebpackCompilerPlugin } = require("webpack-compiler-plugin");

module.exports = {
    mode: "development",
    plugins: [
        new WebpackCompilerPlugin({
            name: "my-compile-plugin",
            listeners: {
                buildStart: () => execSync("echo 'hello'"),
                buildEnd: () => execSync("echo 'bye bye'"),
            },
            stageMessages: null, // to disable stage messages
        }),
    ],
};
```
