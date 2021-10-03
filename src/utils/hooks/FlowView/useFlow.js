/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
