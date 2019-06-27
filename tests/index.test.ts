import CompilerPlugin from "index";

it("loads with default listeners", (): void => {
    new CompilerPlugin({ name: "webpack-compiler-plugin", listeners: {} });
});
