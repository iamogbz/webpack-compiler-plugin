import { Compiler } from "webpack";

import { stageMessages } from "./constants";

const log = console.log.bind(console); // eslint-disable-line no-console
const defaultListeners: Partial<StageListeners> = {
    buildError: (e: Error) => {
        console.error(e.stack); // eslint-disable-line no-console
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

    private validate(options: Options) {
        const validOptions: Options = { ...options, listeners: {} };
        for (const stage of Object.keys(stageMessages) as Stage[]) {
            const listener = options.listeners[stage];
            const validListener =
                typeof listener === "function"
                    ? listener
                    : defaultListeners[stage];
            validOptions.listeners[stage] = async () => {
                log(stageMessages[stage].enter);
                validListener && validListener();
                log(stageMessages[stage].exit);
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
