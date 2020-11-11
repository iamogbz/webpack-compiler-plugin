import { Compiler } from "webpack";

import { logger } from "./logger";
import { defaultStageMessages } from "./constants";
import { Options, Stage, StageListeners } from "./types";
import { stageMessage } from "./terminal";

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
        listeners = {},
        stageMessages = defaultStageMessages,
        ...options
    }: Options) {
        const validOptions: Options = {
            ...options,
            stageMessages,
            listeners,
        };
        const stages = new Set([
            ...Object.keys(listeners ?? {}),
            ...Object.keys(stageMessages ?? {}),
        ]);
        for (const stage of stages as Set<Stage>) {
            const enterMessage = stageMessages?.[stage]?.enter;
            const exitMessage = stageMessages?.[stage]?.exit;
            const listener = listeners[stage];
            const validListener =
                typeof listener === "function"
                    ? listener
                    : defaultListeners[stage];
            validOptions.listeners[stage] = (...args) => {
                enterMessage &&
                    logger.info(stageMessage(options.name, enterMessage));
                return Promise.resolve(
                    validListener && validListener(...args),
                ).then(() => {
                    exitMessage &&
                        logger.info(stageMessage(options.name, exitMessage));
                });
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
