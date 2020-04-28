import { Compiler } from "webpack";

import { defaultStageMessages } from "./constants";

const log = console.log.bind(console); // eslint-disable-line no-console
const defaultListeners: Partial<StageListeners> = {
    buildError: (e: Error) => {
        console.error(e); // eslint-disable-line no-console
        process.exit(1);
    },
    interrupt: () => {
        process.exit(2);
    },
};

export class WebpackCompilerPlugin {
    private options: Options;

    public constructor(options: Options) {
        this.options = this.validate(options);
    }

    private validate({
        stageMessages = defaultStageMessages,
        ...options
    }: Options) {
        const validOptions: Options = {
            ...options,
            stageMessages,
            listeners: {},
        };
        for (const stage of Object.keys(stageMessages) as Stage[]) {
            const enterMessage = stageMessages?.[stage]?.enter;
            const exitMessage = stageMessages?.[stage]?.exit;
            if (!enterMessage && !exitMessage) {
                continue;
            }
            const listener = options.listeners[stage];
            const validListener =
                typeof listener === "function"
                    ? listener
                    : defaultListeners[stage];
            validOptions.listeners[stage] = async (...args) => {
                enterMessage && log(enterMessage);
                validListener && validListener(...args);
                exitMessage && log(exitMessage);
            };
        }
        return validOptions;
    }

    public apply(compiler: Compiler) {
        const { name, listeners } = this.options;
        compiler.hooks.afterPlugins.tap(name, listeners.buildStart);
        process.on("exit", listeners.buildEnd);
        process.on("uncaughtException", listeners.buildError);
        compiler.hooks.compilation.tap(name, listeners.compileStart);
        compiler.hooks.done.tap(name, listeners.compileEnd);
        process.on("SIGINT", listeners.interrupt);
    }
}
