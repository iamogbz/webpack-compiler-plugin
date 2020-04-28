const stageMessage = (m: TemplateStringsArray) => (m ? `\n${String(m)}` : "");

export const defaultStageMessages: Record<
    Stage,
    { enter?: string; exit?: string }
> = {
    buildEnd: {
        enter: stageMessage`🌇 Build exiting 🌇`,
        exit: stageMessage`🌇 🌇 🌇 🌇 🌇`,
    },
    buildError: {
        enter: stageMessage`🚒 Build failed 🚒`,
    },
    buildStart: {
        enter: stageMessage`🌅 Build starting 🌅`,
        exit: stageMessage`🌅 🌅 🌅 🌅 🌅`,
    },
    compileEnd: {
        enter: stageMessage`⌛ Code compiled ⌛`,
        exit: stageMessage`⌛ ⌛ ⌛ ⌛ ⌛`,
    },
    compileStart: {
        enter: stageMessage`⏳ Code compiling ⏳`,
        exit: stageMessage`⏳ ⏳ ⏳ ⏳ ⏳`,
    },
    interrupt: {
        enter: stageMessage`🚧 Build interrupted 🚧`,
    },
};
