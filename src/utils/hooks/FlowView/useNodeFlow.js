/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

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
