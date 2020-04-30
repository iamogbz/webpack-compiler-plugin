const stageMessage = (m: TemplateStringsArray) => (m ? `\n${String(m)}` : "");

export const defaultStageMessages: Record<
    Stage,
    { enter?: string; exit?: string }
> = {
    buildEnd: {
        enter: stageMessage`🌇 Build exiting 🌇`,
    },
    buildError: {
        enter: stageMessage`🚒 Build failed 🚒`,
    },
    buildStart: {
        enter: stageMessage`🌅 Build starting 🌅`,
    },
    compileEnd: {
        enter: stageMessage`⌛ Code compiled ⌛`,
    },
    compileStart: {
        enter: stageMessage`⏳ Code compiling ⏳`,
    },
    interrupt: {
        enter: stageMessage`🚧 Build interrupted 🚧`,
    },
};
