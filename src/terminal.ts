const supportsColor = () =>
    process.stdout.isTTY &&
    !(process.env.ANSI_COLORS_DISABLED || process.env.NO_COLOR);

const style = (text: string, [a, b]: [number, number]) =>
    supportsColor() ? `\x1b[${a}m${text}\x1b[${b}m` : text;

export const bold = (text: string) => style(text, [1, 22]);

export const stageMessage = (name: string, message: string) =>
    `\n${bold(`${name}:`)} ${message}`;
