import React, { useEffect, useRef, useState } from 'react';
import { makeStyles } from "@material-ui/core";
import { inject, observer } from "mobx-react";
import useCamera from "../../utils/hooks/FlowView/useCamera";
import ShortDis from './components/ShortDis';

// const useStyles = makeStyles(theme => ({
//     svg: {
//         '& text': {
//             // transform: props => `scale(${1 / props.scale})`
//         }
//     },
// }));

const NavSvg = React.forwardRef((props,ref) => {
    const {d, children, width, height, initialScale, nodesProps } = props;
    const svg = useRef(null);
    const rectRef = useRef(null);
    const { viewX, viewY, viewW, viewH, scale, reset, handleChangeScaleLevel ,displayShortChart} = useCamera(svg, width, height,rectRef);
    // const classes = useStyles({ scale });
    useEffect(() => {
        handleChangeScaleLevel(initialScale);
    }, [initialScale])

    useEffect(()=>{
        reset();
    },[d.grapth])

    return <>
        <ShortDis 
            width={width} 
            height={height} 
            initialScale={initialScale} 
            nodesProps={nodesProps} 
            scale={scale}
            viewX={viewX} 
            viewY={viewY} 
            viewW={viewW} 
            viewH={viewH}
            ref={rectRef}
            displayShortChart={displayShortChart}
             />
        <svg
            ref={svg}
            // onDoubleClick={reset}
            width={width} height={height}
            viewBox={`${viewX} ${viewY} ${viewW} ${viewH}`}
        >
            <defs>
                <filter id="shadow" x={'-100%'} y={'-100%'} width="500%" height="500%">
                    <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                    <feComponentTransfer in="offOut" result="transferOut">
                        <feFuncR type="discrete" tableValues="1" />
                        <feFuncG type="discrete" tableValues="0" />
                        <feFuncB type="discrete" tableValues="0" />
                    </feComponentTransfer>
                    <feGaussianBlur result="blurOut" in="transferOut" stdDeviation="5" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
            </defs>
            <defs>
                <filter id="lightShadow" x={'-100%'} y={'-100%'} width="500%" height="500%">
                    <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0" />
                    <feComponentTransfer in="offOut" result="transferOut">
                        <feFuncR type="discrete" tableValues="1" />
                        <feFuncG type="discrete" tableValues="0.2" />
                        <feFuncB type="discrete" tableValues="0" />
                    </feComponentTransfer>
                    <feGaussianBlur result="blurOut" in="transferOut" stdDeviation="5" />
                    <feBlend in="SourceGraphic" in2="blurOut" mode="normal" />
                </filter>
            </defs>
            <g ref={ref}>
                {children}
            </g>
        </svg>
    </>
})

export default inject('d')(observer(NavSvg));
