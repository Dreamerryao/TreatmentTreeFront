/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useRef} from "react";
import {inject, observer} from "mobx-react";
import {createStyles, makeStyles, Typography} from "@material-ui/core";
import useSizeWithDefaultSize from "../../utils/hooks/useSize";
import {heIL} from "@material-ui/core/locale";
import clsx from "clsx";
import useFlow from "../../utils/hooks/FlowView/useFlow";

const useStyle = makeStyles((theme) => createStyles({
    root: {
        height: '100%',
    },
    gridHead: {
        height: ({height}) => height,
        width: ({gridWidth}) => gridWidth * 5 + 1,
    },
    grid: {
        stroke: 'rgb(0, 0, 0)',
        fill: 'rgb(255, 255, 255)',
        strokeWidth: ({gridWidth}) => gridWidth / 10,
    },
    blankGrid: {
        fill: 'rgb(255, 255, 255)',
    },
    actionGrid: {
        fill: ({actionColor}) => actionColor,
    },
    innerGrid: {
        width: ({gridWidth}) => gridWidth - gridWidth / 4,
        height: ({gridHeight}) => gridHeight - gridHeight / 4,
        x: ({gridWidth}) => gridWidth / 8,
        y: ({gridHeight}) => gridHeight / 8,
        // transform: ({gridWidth, gridHeight}) => `translate(${gridWidth / 20}, ${gridHeight / 20})`,
    },
    outerGrid: {
        fill: 'rgb(255, 255, 255)',
        width: ({gridWidth}) => gridWidth,
        height: ({gridHeight}) => gridHeight,
    },
    blankLinear: {
        height: '40%',
    },
    linearGradient: {
        height: '20%',
        width: ({requireWidth}) => requireWidth,
        maxWidth: '100%',
        display: 'flex',
    },
    linearGradientLeft: {
        background: ({mortalityColor}) => `linear-gradient(to right, ${mortalityColor[0]}, white)`,
        height: '100%',
        width: '50%',
    },
    linearGradientRight: {
        background: ({mortalityColor}) => `linear-gradient(to right, white, ${mortalityColor[1]})`,
        height: '100%',
        width: '50%',
    }
}));

const useLinkStyle = makeStyles((theme) => createStyles({
    root: {
        height: '100%',
    },
    linkBackground: {
        fill: ({linkColor}) => linkColor,
        fillOpacity: 0.5
        // fillOpacity: ({backgroundOpacity}) => backgroundOpacity.current,
    },
    blankDiv: {
        height: '20%',
    },
    requireWidth: {
        width: ({requireWidth}) => requireWidth,
    }
}))

const GridPanel = inject('d')(observer(({d, actionColor, defaultNumber}) => {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);
    const gridHeight = height * 0.7;
    const gridWidth = gridHeight * 0.5;

    const classes = useStyle({width, height, gridWidth, gridHeight, actionColor, mortalityColor: d.mortalityColor});
    return <div ref={ref} className={classes.root}>
        <svg className={classes.gridHead}>
            <g transform={`translate(${0.5}, ${(height - gridHeight) / 2})`}>
                <rect width={gridWidth * 5} height={gridHeight} className={classes.grid}/>
                {[0,1,2,3,4].map(idx => (
                    <g transform={`translate(${gridWidth * idx}, ${0})`} key={idx}>
                        <rect key={`${idx},${0}`} width={gridWidth} height={gridHeight}
                              className={clsx(classes.outerGrid)}
                        />
                        <rect key={`inner${idx},${0}`} className={clsx(classes.innerGrid, {
                            [classes.blankGrid]: idx >= defaultNumber,
                            [classes.actionGrid]: idx < defaultNumber,
                        })}/>
                    </g>
                ))}
            </g>
        </svg>
    </div>
}))

const LinkPanel = inject('d')(observer(({d, requireWidth}) => {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);
    const linkColor = d.branchColor[0];
    const classes = useLinkStyle({linkColor, requireWidth: !!requireWidth ? requireWidth : 50});

    console.log(requireWidth, height)

    const path = useFlow([0, 0], [0, height * 0.6 / 2], [requireWidth, height * 0.6 / 2], [requireWidth, height * 0.6], 1, 1);

    return (<div ref={ref} className={classes.root}>
        <div className={classes.blankDiv}/>
        <svg className={clsx(classes.root, classes.requireWidth)}>
            <g className={clsx(classes.root)}>
                <path d={path}
                      className={clsx(classes.linkBackground)}
                />
            </g>
        </svg>
    </div>);
}))


const MortalityRatePanel = inject('d')(observer(({d, requireWidth}) => {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);
    const mortalityColor = d.mortalityColor;

    const classes = useStyle({mortalityColor, requireWidth: !!requireWidth ? requireWidth : 100});

    return <div ref={ref} className={classes.root}>
        <div className={classes.blankLinear}/>
        <div className={classes.linearGradient}>
            <div className={classes.linearGradientLeft}/>
            <div className={classes.linearGradientRight}/>
        </div>
    </div>
}));


export {GridPanel, MortalityRatePanel, LinkPanel};
