/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useRef} from 'react';
import {makeStyles} from "@material-ui/core";
import {inject, observer} from "mobx-react";
import useCamera from "../../utils/hooks/FlowView/useCamera";

const useStyles = makeStyles(theme => ({
    svg: {
        '& text': {
            transform: props => `scale(${1 / props.scale})`
        }
    },
}));

const NavSvg = React.memo(function ({children, width, height}) {
    const svg = useRef(null);
    const {viewX, viewY, viewW, viewH, scale, reset} = useCamera(svg, width, height);

    const classes = useStyles({scale});
    return <svg className={classes.svg}
                ref={svg}
                // onDoubleClick={reset}
                width={width} height={height}
                viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}
    >
        <defs>
            <filter id="shadow" x={'-100%'} y={'-100%'} width="500%" height="500%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0"/>
                <feComponentTransfer in="offOut" result="transferOut">
                    <feFuncR type="discrete" tableValues="1"/>
                    <feFuncG type="discrete" tableValues="0"/>
                    <feFuncB type="discrete" tableValues="0"/>
                </feComponentTransfer>
                <feGaussianBlur result="blurOut" in="transferOut" stdDeviation="5"/>
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
            </filter>
        </defs>
        <defs>
            <filter id="lightShadow" x={'-100%'} y={'-100%'} width="500%" height="500%">
                <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0"/>
                <feComponentTransfer in="offOut" result="transferOut">
                    <feFuncR type="discrete" tableValues="1"/>
                    <feFuncG type="discrete" tableValues="0.2"/>
                    <feFuncB type="discrete" tableValues="0"/>
                </feComponentTransfer>
                <feGaussianBlur result="blurOut" in="transferOut" stdDeviation="5"/>
                <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
            </filter>
        </defs>
        {children}
    </svg>
})

export default NavSvg;
