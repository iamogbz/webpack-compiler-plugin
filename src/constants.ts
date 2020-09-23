import { Stage } from "./types";
import { style, styles } from "./terminal";

export const defaultStageMessages: Record<
    Stage,
    { enter?: string; exit?: string }
> = {
    buildEnd: {
        enter: "👋 build exiting",
    },
    buildError: {
        enter: style("🚒 build failed", styles.colors.red, true),
    },
    buildStart: {
        enter: style("🚀 build starting", styles.colors.blue, true),
    },
    compileEnd: {
        enter: style("⌛ code compiled", styles.colors.green, true),
    },
    compileStart: {
        enter: style("⏳ code compiling", styles.colors.blue, true),
    },
    interrupt: {
        enter: style("🚧 build interrupted", styles.colors.yellow, true),
    },
};
