import { Compiler } from "webpack";
import { WebpackCompilerPlugin } from "index";

const processExitSpy = jest
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

const consoleLogSpy = jest.spyOn(console, "log");
const consoleErrorSpy = jest.spyOn(console, "error");

const mockCompiler = {
    hooks: {
        afterPlugins: { tap: jest.fn() },
        compilation: { tap: jest.fn() },
        done: { tap: jest.fn() },
    },
};

const newPlugin = (listeners: Partial<StageListeners> = {}) => {
    const plugin = new WebpackCompilerPlugin({
        name: "webpack-compiler-plugin",
        listeners,
    });
    plugin.apply((mockCompiler as unknown) as Compiler);
    return plugin;
};

afterEach(() => {
    jest.clearAllMocks();
    const signals = ["exit", "SIGINT", "uncaughtException"];
    signals.map(process.removeAllListeners.bind(process));
});
afterAll(jest.restoreAllMocks);

describe("default listeners", () => {
    it.each([
        ["interrupt", ["SIGINT"]],
        ["buildError", ["uncaughtException", new Error("Uncaught Error")]],
    ])("loads with default %s listener", (_, [event, arg]): void => {
        newPlugin();
        process.emit(
            event as NodeJS.Signals,
            (arg as unknown) as NodeJS.Signals,
        );
        expect(consoleErrorSpy.mock.calls).toMatchSnapshot("console error");
        expect(consoleLogSpy.mock.calls).toMatchSnapshot("console log");
        expect(processExitSpy.mock.calls).toMatchSnapshot("process exit");
    });
});

describe("apply listeners", () => {
    it.each([
        ["buildEnd", ["exit"]],
        ["interrupt", ["SIGINT"]],
        ["buildError", ["uncaughtException", new Error("Uncaught Error")]],
    ])(
        "applies handler for stage %s",
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (stage: Stage, [event, arg]: [NodeJS.Signals, any]) => {
            const mockHandler = jest.fn();
            newPlugin({ [stage]: mockHandler });
            process.emit(event, arg);
            expect(mockHandler).toHaveBeenCalledTimes(1);
        },
    );

    it.each([
        ["buildStart", mockCompiler.hooks.afterPlugins.tap],
        ["compileEnd", mockCompiler.hooks.done.tap],
        ["compileStart", mockCompiler.hooks.compilation.tap],
    ])("applies handler for stage %s", (stage, tapFn) => {
        const mockHandler = jest.fn();
        newPlugin({ [stage as Stage]: mockHandler });
        expect(tapFn).toHaveBeenCalledTimes(1);
    });
});
