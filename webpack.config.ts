import * as path from "path";
import { Configuration } from "webpack";
import * as CopyPlugin from "copy-webpack-plugin";

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
};

export default configuration;
