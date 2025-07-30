const hexToRGBA = (hex: string, alpha: number) => {
    let r = 0, g = 0, b = 0;

    // Expand shorthand hex codes like #FFF to #FFFFFF
    if (hex.length === 4) {
        hex = "#" + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }

    // Convert hex to RGB
    if (hex.length === 7) {
        r = parseInt(hex.substring(1, 3), 16);
        g = parseInt(hex.substring(3, 5), 16);
        b = parseInt(hex.substring(5, 7), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export default hexToRGBA;