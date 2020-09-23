import { Stage } from "./types";

export const defaultStageMessages: Record<
    Stage,
    { enter?: string; exit?: string }
> = {
    buildEnd: {
        enter: " 🌇 build exiting",
    },
    buildError: {
        enter: "🚒 build failed",
    },
    buildStart: {
        enter: "🌅 build starting",
    },
    compileEnd: {
        enter: "⌛ code compiled",
    },
    compileStart: {
        enter: "⏳ code compiling",
    },
    interrupt: {
        enter: "🚧 build interrupted",
    },
};
