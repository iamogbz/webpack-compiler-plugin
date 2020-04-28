type Listener = (...args: any[]) => any | Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

type Stage =
    | "buildEnd"
    | "buildError"
    | "buildStart"
    | "compileEnd"
    | "compileStart"
    | "interrupt";
type StageListeners = Record<Stage, Listener>;
type StageMessages = Record<Stage, { enter?: string; exit?: string }>;

interface Options {
    name: string;
    stageMessages?: Partial<StageMessages>;
    listeners: Partial<StageListeners>;
}
