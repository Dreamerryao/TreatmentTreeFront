import {useMemo} from 'react';

const useFlow = (sP1, sP2, tP1, tP2, vw, vh) => {
    return useMemo(() => {
        const sx = sP1[0] * vw, sy = [sP1[1] * vh, sP2[1] * vh]; // start
        const tx = tP1[0] * vw, ty = [tP1[1] * vh, tP2[1] * vh]; // target
        const mx = (sx + tx) / 2; // mid
        return `M${sx} ${sy[0]}
                C${mx} ${sy[0]} ${mx} ${ty[0]} ${tx} ${ty[0]}
                V${ty[1]}
                C${mx} ${ty[1]} ${mx} ${sy[1]} ${sx} ${sy[1]}
                Z`;
    }, [sP1, sP2, tP1, tP2, vh, vw]);
};

export default useFlow;
