import { execSync } from "child_process";
import * as path from "path";
import { Configuration } from "webpack";
import * as CopyPlugin from "copy-webpack-plugin";
import { WebpackCompilerPlugin } from "./src";

const outputPath = path.resolve(__dirname, "lib");
const configuration: Configuration = {
    devtool: "source-map",
    entry: "./src",
    mode: "production",
    module: {
        rules: [
            {
                exclude: /(node_modules|bower_components)/,
                test: /\.tsx?$/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-typescript"],
                        plugins: [
                            "@babel/plugin-proposal-optional-chaining",
                            "@babel/plugin-proposal-nullish-coalescing-operator",
                        ],
                    },
                },
            },
        ],
    },
    output: {
        filename: "index.js",
        libraryTarget: "commonjs",
        path: outputPath,
    },
    plugins: [
        new WebpackCompilerPlugin({
            name: "compiler",
            listeners: {
                buildStart: () => execSync("npm run clean"),
                compileStart: () => execSync("npm run build-types"),
            },
            stageMessages: {
                buildStart: { enter: "clean ouput path" },
                compileStart: {
                    enter: "building types: started",
                    exit: "building types: finished",
                },
            },
        }),
        new CopyPlugin({
            patterns: [
                "package.json",
                "README.md",
                "built/src",
                { from: "src/types.d.ts", to: outputPath },
            ],
        }),
    ],
    resolve: {
        extensions: [".js", ".ts"],
        modules: [path.resolve("./src"), path.resolve("./node_modules")],
    },
    target: "node",
    watchOptions: {
        ignored: ["./node_modules/**", "./tests/**", "./built/**", outputPath],
    },
};

export default configuration;
