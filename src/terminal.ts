const supportsColor = () =>
    process.stdout.isTTY &&
    !(process.env.ANSI_COLORS_DISABLED || process.env.NO_COLOR);

export const style = (
    text: string,
    [a, b]: [number, number],
    force?: boolean,
) => (supportsColor() || force ? `\x1b[${a}m${text}\x1b[${b}m` : text);

export const styles: Record<string, Record<string, [number, number]>> = {
    attrs: {
        bold: [1, 22],
    },
    colors: {
        blue: [34, 39],
        green: [32, 39],
        red: [31, 39],
        yellow: [33, 39],
    },
};

export const stageMessage = (name: string, message: string) =>
    `\n${style(`${name}:`, styles.attrs.bold)} ${message}`;
