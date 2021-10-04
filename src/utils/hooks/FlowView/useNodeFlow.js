import {useMemo} from "react";

const useNodeFlow = ((expanded, x, y, width, heightFront, heightBack, vw, vh, ox, bx, expandedY) => {
    return useMemo(() => {
        const sx = x, sy = [y * vh, (y + heightFront) * vh];
        const tx = x + width, ty = [(y + heightFront / 2 - heightBack / 2) * vh, (y + heightFront / 2 + heightBack / 2) * vh];
        const mx = (sx + tx) / 2;
        return {
            path: `M${sx} ${sy[0]}
                   C${mx} ${sy[0]} ${mx} ${ty[0]} ${tx} ${ty[0]}
                   L${tx} ${ty[1]}
                   C${mx} ${ty[1]} ${mx} ${sy[1]} ${sx} ${sy[1]}
                   Z`,
            strokePath: `M${sx} ${sy[0]}
                         C${mx} ${sy[0]} ${mx} ${ty[0]} ${tx} ${ty[0]}
                         L${tx} ${ty[1]}
                         C${mx} ${ty[1]} ${mx} ${sy[1]} ${sx} ${sy[1]}
                         H${ox}
                         V${sy[0]}
                         Z`,
            gapPath: `M${ox} ${sy[0]}
                      H${sx}
                      C${mx} ${sy[0]} ${mx} ${ty[0]} ${tx} ${ty[0]}
                      M${tx} ${ty[1]}
                      C${mx} ${ty[1]} ${mx} ${sy[1]} ${sx} ${sy[1]}
                      H${ox}`,
        }
    }, [ox, x, y, width, heightFront, heightBack, vh, expanded]);
});

export default useNodeFlow;
