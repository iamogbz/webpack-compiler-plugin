import { Compiler } from "webpack";
import { WebpackCompilerPlugin } from "index";
import { logger } from "logger";

const processExitSpy = jest
    .spyOn(process, "exit")
    .mockImplementation(() => undefined as never);

const consoleLogSpy = jest.spyOn(logger, "info");
const consoleErrorSpy = jest.spyOn(logger, "error");

const mockCompiler = {
    hooks: {
        afterPlugins: { tap: jest.fn() },
        compilation: { tap: jest.fn() },
        done: { tap: jest.fn() },
    },
};

const newPlugin = ({
    listeners = {},
    stageMessages,
}: {
    listeners?: Partial<StageListeners>;
    stageMessages?: Partial<StageMessages>;
}) => {
    const plugin = new WebpackCompilerPlugin({
        name: "webpack-compiler-plugin",
        listeners,
        stageMessages,
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
        newPlugin({});
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
            newPlugin({ listeners: { [stage]: mockHandler } });
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
        newPlugin({ listeners: { [stage as Stage]: mockHandler } });
        expect(tapFn).toHaveBeenCalledTimes(1);
        tapFn.mock.calls[0][1]();
        expect(mockHandler).toHaveBeenCalledTimes(1);
    });
});

describe("stage messages", () => {
    it.each([
        ["buildStart", mockCompiler.hooks.afterPlugins.tap],
        ["compileEnd", mockCompiler.hooks.done.tap],
        ["compileStart", mockCompiler.hooks.compilation.tap],
    ])("uses default state messages %s", (stage, tapFn) => {
        const mockHandler = jest.fn();
        newPlugin({ listeners: { [stage as Stage]: mockHandler } });
        tapFn.mock.calls[0][1]();
        expect(consoleLogSpy).toHaveBeenCalledTimes(1);
        expect(consoleLogSpy.mock.calls).toMatchSnapshot();
    });

    it.each([
        ["buildStart", mockCompiler.hooks.afterPlugins.tap],
        ["compileEnd", mockCompiler.hooks.done.tap],
        ["compileStart", mockCompiler.hooks.compilation.tap],
    ])("does not use default state messages %s", (stage, tapFn) => {
        const mockHandler = jest.fn();
        newPlugin({
            listeners: { [stage as Stage]: mockHandler },
            stageMessages: null,
        });
        tapFn.mock.calls[0][1]();
        expect(consoleLogSpy).toHaveBeenCalledTimes(0);
        expect(consoleLogSpy.mock.calls).toMatchSnapshot();
    });
});
