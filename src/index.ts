import { Compiler } from "webpack";

const stageIcons: Record<Stage, string> = {
    buildEnd: "🌇",
    buildError: "🚒",
    buildStart: "🌅",
    compileEnd: "⌛",
    compileStart: "⏳",
    interrupt: "🚧",
};

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
        for (const stage of Object.keys(stageIcons) as Stage[]) {
            const listener = options.listeners[stage];
            const validListener =
                typeof listener === "function"
                    ? listener
                    : defaultListeners[stage];
            validOptions.listeners[stage] = async () => {
                console.log(stageIcons[stage]); // eslint-disable-line no-console
                validListener && validListener();
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
