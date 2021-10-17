import { useMemo } from "react";

function tanh(x) {
    return (Math.exp(x) - Math.exp(-x)) / (Math.exp(x) + Math.exp(-x));
}

const useRateColor = (r, baseColor) => {
    const color = useMemo(() => {
        if (isNaN(r)) {
            return baseColor[0];
        }
        const bColor = r > 0 ? baseColor[0] : baseColor[1];
        const rr = tanh(r * 3 * 2) / 2;
        // console.log(r,rr, bColor);
        const rgb = bColor.substring(4, bColor.length - 1)
            .replace(/ /g, '')
            .split(',')
            .map(v => (255 - v) / 0.5 * (0.5 - Math.abs(rr)) + parseFloat(v));
        // console.log(rgb);
        return "rgb(" + rgb.join(", ") + ")";
    }, [r, baseColor]);

    return color;
}



export default useRateColor;
