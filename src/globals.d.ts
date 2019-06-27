type Listener = (...args: any[]) => any | Promise<any>; // eslint-disable-line @typescript-eslint/no-explicit-any

type Stage = "buildEnd" | "buildStart" | "compileEnd" | "compileStart";
type StageListeners = { [key in Stage]: Listener };

interface Options {
    name: string;
    listeners: Partial<StageListeners>;
}
