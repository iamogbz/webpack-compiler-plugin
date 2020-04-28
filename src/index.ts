import { Compiler } from "webpack";

import { logger } from "./logger";
import { defaultStageMessages } from "./constants";

const defaultListeners: Partial<StageListeners> = {
    buildError: (e: Error) => {
        logger.error(e); // eslint-disable-line no-console
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
        };
        const listeners = { ...defaultListeners, ...options.listeners };
        for (const stage of Object.keys(listeners) as Stage[]) {
            const enterMessage = stageMessages?.[stage]?.enter;
            const exitMessage = stageMessages?.[stage]?.exit;
            const listener = listeners[stage];
            const validListener =
                typeof listener === "function"
                    ? listener
                    : defaultListeners[stage];
            validOptions.listeners[stage] = async (...args) => {
                enterMessage && logger.info(enterMessage);
                validListener && validListener(...args);
                exitMessage && logger.info(exitMessage);
            };
        }
        return validOptions;
    }

    public apply(compiler: Compiler) {
        const { name, listeners } = this.options;
        if (listeners.buildStart) {
            compiler.hooks.afterPlugins.tap(name, listeners.buildStart);
        }
        if (listeners.buildEnd) {
            process.on("exit", listeners.buildEnd);
        }
        if (listeners.buildError) {
            process.on("uncaughtException", listeners.buildError);
        }
        if (listeners.compileStart) {
            compiler.hooks.compilation.tap(name, listeners.compileStart);
        }
        if (listeners.compileEnd) {
            compiler.hooks.done.tap(name, listeners.compileEnd);
        }
        if (listeners.interrupt) {
            process.on("SIGINT", listeners.interrupt);
        }
    }
}
