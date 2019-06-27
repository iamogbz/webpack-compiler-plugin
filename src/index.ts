import { Compiler, Plugin } from "webpack";

export default class CompilerPlugin extends Plugin {
    private options: Options;
    private defaultListeners: StageListeners = {
        buildEnd: () => console.log("Build exited"), // eslint-disable-line no-console
        buildStart: () => console.log("Build started"), // eslint-disable-line no-console
        compileEnd: () => console.log("Compile ended"), // eslint-disable-line no-console
        compileStart: () => console.log("Compile started"), // eslint-disable-line no-console
    };

    public constructor(options: Options) {
        super();
        this.options = this.validate(options);
    }

    private validate(options: Options) {
        const validOptions: Options = { ...options, listeners: {} };
        for (const stage of Object.keys(this.defaultListeners) as Stage[]) {
            const listener = options.listeners[stage];
            if (typeof listener === "function") {
                validOptions.listeners[stage] = listener;
            } else {
                // eslint-disable-next-line no-console
                console.warn("Ignoring invalid stage listener:", {
                    stage,
                    listener,
                });
                validOptions.listeners[stage] = this.defaultListeners[stage];
            }
        }
        return options;
    }

    private cleanup(listener: Listener) {
        process.on("exit", () => {
            listener();
        });
        process.on("uncaughtException", e => {
            console.error(e.stack); // eslint-disable-line no-console
            process.exit(1);
        });
        process.on("SIGINT", () => {
            process.exit(2);
        });
    }

    public apply = (compiler: Compiler): void => {
        const { name, listeners } = this.options;
        compiler.hooks.afterPlugins.tap(name, listeners.buildStart);
        compiler.hooks.compilation.tap(name, listeners.compileStart);
        compiler.hooks.done.tap(name, listeners.compileEnd);
        this.cleanup(listeners.buildEnd);
    };
}
