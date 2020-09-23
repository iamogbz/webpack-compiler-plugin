export type Listener = (...args: any[]) => any | Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Stage =
    | "buildEnd"
    | "buildError"
    | "buildStart"
    | "compileEnd"
    | "compileStart"
    | "interrupt";
export type StageListeners = Record<Stage, Listener>;
export type StageMessages = Record<Stage, { enter?: string; exit?: string }>;

export interface Options {
    name: string;
    stageMessages?: Partial<StageMessages>;
    listeners: Partial<StageListeners>;
}
