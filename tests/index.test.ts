import { WebpackCompilerPlugin } from "index";

it("loads with default listeners", (): void => {
    new WebpackCompilerPlugin({
        name: "webpack-compiler-plugin",
        listeners: {},
    });
});
