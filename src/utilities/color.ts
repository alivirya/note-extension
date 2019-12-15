type rgb = {
    red: number;
    green: number;
    blue: number;
}

export function getRGB(color: string){
    let match = color.match(/rgb?\((\d{1,3}), ?(\d{1,3}), ?(\d{1,3})\)?(?:, ?(\d(?:\.\d?))\))?/);
    return match ? {
        red: parseInt(match[1]),
        green: parseInt(match[2]),
        blue: parseInt(match[3])
    } : {
        red: 0,
        green: 0,
        blue: 0
    };
}

export function invertRGB(color: string) {
    let colors: rgb = getRGB(color);
    let invertedColors: rgb = {
        red: 255 - colors.red,
        green: 255 - colors.green, 
        blue: 255 - colors.blue
    }
    return `rgb(${invertedColors.red}, ${invertedColors.green}, ${invertedColors.blue})`;
}

export function getLighter(color: string) {
    let colors: rgb = getRGB(color);
    let lighterColors: rgb = {
        red: colors.red + 30,
        green: colors.green + 30, 
        blue: colors.blue + 30
    }
    return `rgb(${lighterColors.red}, ${lighterColors.green}, ${lighterColors.blue})`;
}
