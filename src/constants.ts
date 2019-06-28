const enterStageMessage = (m: TemplateStringsArray) =>
    `\n------${String(m) ? `\n${m}` : ""}`;

const endStageMessage = (m: TemplateStringsArray) =>
    `${String(m) ? `${m}\n` : ""}------`;

export const stageMessages: Record<Stage, { enter?: string; exit?: string }> = {
    buildEnd: {
        enter: enterStageMessage`🌇  Build exiting...`,
        exit: endStageMessage``,
    },
    buildError: {
        enter: enterStageMessage`🚒  Build failed.`,
    },
    buildStart: {
        enter: enterStageMessage`🌅  Build starting...`,
        exit: endStageMessage``,
    },
    compileEnd: {
        enter: enterStageMessage`⌛  Code compiled.`,
        exit: endStageMessage``,
    },
    compileStart: {
        enter: enterStageMessage`⏳  Code compiling...`,
        exit: endStageMessage``,
    },
    interrupt: {
        enter: enterStageMessage`🚧  Build interrupted.`,
    },
};
