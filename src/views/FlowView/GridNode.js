import React, {useCallback, useState} from "react";
import clsx from "clsx";
import {inject, observer} from "mobx-react";
import interpolate from "color-interpolate"
import {createStyles, makeStyles} from "@material-ui/core";
import Tooltip from "@material-ui/core/Tooltip";

const useBinStyles = makeStyles((theme) => createStyles({
    outerNode: {
        fill: 'rgb(255, 255, 255)',
        // fillOpacity: 0.8,
        width: ({width}) => width - width / 4,
        height: ({height}) => height,
        x: ({width}) => width / 8,
    },
    stroke: {
        stroke: 'rgb(0, 0, 0)',
        strokeWidth: ({width}) => width / 50,
    },
    innerNode: {
        fill: ({innerBoxColor}) => innerBoxColor,
        width: ({width}) => width - width / 3,
        height: ({barHeight}) => barHeight - barHeight / 4,
        x: ({width}) => width / 6,
        y: ({barHeight}) => barHeight / 8,
    },
    innerCircle: {
        fill: ({innerBoxColor}) => innerBoxColor,
        r: ({width}) => width * 3 / 8,
        cx: ({width}) => width / 2,
        cy: ({height}) => height / 2,
    }
}));

const useRangeStyles = makeStyles((theme) => createStyles({
    stroke: {
        stroke: 'rgb(0, 0, 0)',
        strokeWidth: 2,
    },
    normalRect: {
        fill: ({normalColor}) => normalColor,
    },
    valueCircle: {
        fill: ({nodeColor}) => nodeColor
    },
    background: {
        fill: 'rgb(233,233,233)'
    },
    highRect: {
        fill: 'rgb(240,193,66)'
    },
    lowRect: {
        fill: 'rgb(79,134,234)'
    }
}));


const useActionStyles = makeStyles((theme) => createStyles({
    grid: {
        stroke: 'rgb(0, 0, 0)',
        fill: 'rgb(255, 255, 255)',
        strokeWidth: ({gridWidth}) => gridWidth / 25,
    },
    action1Grid: {
        fill: ({actionColor}) => actionColor[0],
    },
    action2Grid: {
        fill: ({actionColor}) => actionColor[1],
    },
    blankGrid: {
        fill: 'rgb(255, 255, 255)',
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
    stroke: {
        fill: 'none',
    },
    selected: {
        stroke: props => props.highlight,
        strokeWidth: 4,
    }
}))

const useTipStyles = makeStyles((theme) => createStyles({

    tipTable: {
        '& > tbody > tr > th': {
            textAlign: 'right'
        },
        '& > tbody > tr > td': {
            textAlign: 'left'
        },
    }
}))


const NodeTips = React.memo(({valueIndex, value, label, ...props}) => {
    const tipClasses = useTipStyles();
    return <Tooltip title={<table className={tipClasses.tipTable}>
                        <tbody>
                        <tr>
                            <th>Feature:</th>
                            <td>{valueIndex.column_name}</td>
                        </tr>
                        <tr>
                            <th>Value:</th>
                            <td>{Math.round(value * 100) / 100} {valueIndex.unit}</td>
                        </tr>
                        <tr>
                            <th>Label:</th>
                            <td>{label}</td>
                        </tr>
                        {valueIndex.type === 'range' ?
                            <tr>
                                <th>Reference Range:</th>
                                <td>{valueIndex.bins[0]}-{valueIndex.bins[1]} {valueIndex.unit}</td>
                            </tr> :
                            (<React.Fragment>
                                <tr>
                                    <th>{valueIndex.labels[0]}</th>
                                    <td>less than {valueIndex.bins[0]} {valueIndex.unit}</td>
                                </tr>
                                <tr>
                                    <th>{valueIndex.labels[1]}</th>
                                    <td>{valueIndex.bins[0]}-{valueIndex.bins[1]} {valueIndex.unit}</td>
                                </tr>
                                <tr>
                                    <th>{valueIndex.labels[2]}</th>
                                    <td>higher than {valueIndex.bins[1]} {valueIndex.unit}</td>
                                </tr>
                            </React.Fragment>)
                        }
                        </tbody>
                    </table>}
                    {...props}/>

})

const GridNode = inject('d')(observer(({
    d,
    vw,
    vh,
    width,
    height,
    valueIndex,
    value,
}) => {
    const [hoverHighlight, setHoverHighlight] = useState(false)


    const getBinInfo = (v, index) => {
        let i;
        for (i = 0; i < index.bins.length; ++i) {
            if (v < index.bins[i]) break;
        }
        return [d.recordBinColor[2], index.labels[i], i];
    }

    const [innerBoxColor, label, barLevel] = getBinInfo(value, valueIndex);

    const barHeight = height / (valueIndex.bins.length + 1);

    const classes = useBinStyles({innerBoxColor, width: vw * width, height: vh * height, barHeight: vh * barHeight});

    return (
        <NodeTips {...{valueIndex, value, label}}>
            <g
                onMouseEnter={() => {
                    setHoverHighlight(true)
                }}
                onMouseLeave={() => {
                    setHoverHighlight(false)
                }}
                filter={hoverHighlight ? 'url(#lightShadow)' : ''}>
                {/*<rect className={clsx(classes.outerNode)} />*/}
                <rect className={clsx(classes.innerNode, classes.stroke)} />
                {/*<circle className={clsx(classes.innerCircle)}/>*/}
                <rect className={clsx(classes.outerNode, classes.stroke)} />
                {[...Array(valueIndex.bins.length + 1).keys()].map(idx => (
                    <g transform={`translate(0, ${(height - (idx + 1) * barHeight) * vh})`} key={idx}>
                        <rect key={`inner${idx},${1}`} className={clsx({
                            [classes.innerNode]: idx <= barLevel
                        })}/>
                    </g>
                ))}
            </g>
        </NodeTips>);
}));

const RangeNode = inject('d')(observer(({
    d,
    vw,
    vh,
    width,
    height,
    valueIndex,
    value,
}) => {
    const [hoverHighlight, setHoverHighlight] = useState(false);

    const getRangeInfo = (v, index) => {
        if (index.bins[0] <= v && v <= index.bins[1]) {
            return [d.recordRangeColor[1], index.labels[1], 1];
        }
        const colorMap = interpolate([d.recordRangeColor[0], d.recordRangeColor[1], d.recordRangeColor[2]]);
        const colorIndex = v < index.bins[0] ?
            0.5 * Math.max(0, 1 - (index.bins[0] - v) / (index.bins[1] - index.bins[0])) :
            0.5 + 0.5 * Math.min(1, (v - index.bins[1]) / (index.bins[1] - index.bins[0]));
        return [colorMap(colorIndex), index.labels[colorIndex < 0.5 ? 0 : 2], colorIndex < 0.5 ? 0 : 2];
    }

    const [innerBoxColor, label, rangeLevel] = getRangeInfo(value, valueIndex);

    const [highRate, normalRate, lowRate] = value < valueIndex.bins[0] ?
        [1, 1, Math.max(1, 0.5 + (valueIndex.bins[0] - value) / (valueIndex.bins[1] - valueIndex.bins[0]))] :
        [Math.max(1, 0.5 + (value - valueIndex.bins[1]) / (valueIndex.bins[1] - valueIndex.bins[0])), 1, 1];

    const sumRate = highRate + normalRate + lowRate;

    const [highLength, normalLength, lowLength] = [height * highRate / sumRate, height * normalRate / sumRate, height * lowRate / sumRate];

    const valuePos =
        value < valueIndex.bins[0] ?
            lowLength - height * (valueIndex.bins[0] - value) / (valueIndex.bins[1] - valueIndex.bins[0]) / sumRate :
        valueIndex.bins[0] <= value && value <= valueIndex.bins[1] ?
            lowLength + height * (value - valueIndex.bins[0]) / (valueIndex.bins[1] - valueIndex.bins[0]) / sumRate :
            lowLength + normalLength + height * (value - valueIndex.bins[1]) / (valueIndex.bins[1] - valueIndex.bins[0]) / sumRate;

    const rectHeight =
        value < valueIndex.bins[0] ?
            -height / 2 * Math.min(1, (valueIndex.bins[0] - value) / (valueIndex.bins[1] - valueIndex.bins[0])):
            valueIndex.bins[0] <= value && value <= valueIndex.bins[1] ?
                0:
                height / 2 * Math.min(1, (value - valueIndex.bins[1]) / (valueIndex.bins[1] - valueIndex.bins[0]));

    const rangeWidth = 0.01;

    const classes = useRangeStyles({nodeColor: innerBoxColor, normalColor: d.recordBinColor[2]});
    return (
        <NodeTips {...{valueIndex, value, label}}>

            <g onMouseEnter={() => {
                    setHoverHighlight(true)
                }}
                onMouseLeave={() => {
                    setHoverHighlight(false)
                }}
                filter={hoverHighlight ? 'url(#lightShadow)' : ''}>
                {/*<rect x={(width/2 - rangeWidth/2) * vw} y={lowLength * vh} width={rangeWidth * vw} height={normalLength * vh} className={classes.normalRect} />*/}
                {/*<line x1={(width/2 - rangeWidth/2) * vw} y1={0} x2={(width/2 + rangeWidth/2) * vw} y2={0} className={classes.stroke} />*/}
                {/*<line x1={width/2 * vw} y1={0} x2={width/2 * vw} y2={height * vh} className={classes.stroke} />*/}
                {/*<line x1={(width/2 - rangeWidth/2) * vw} y1={height * vh} x2={(width/2 + rangeWidth/2) * vw} y2={height * vh} className={classes.stroke} />*/}

                {/*<circle cx={width/2 * vw} cy={valuePos * vh} r={rangeWidth/4*vw} className={classes.valueCircle} />*/}


                <rect x={(width/2 - rangeWidth/2) * vw} y={0} width={rangeWidth * vw} height={height * vh} className={classes.background}/>
                {rectHeight > 0 ?
                    <rect x={(width/2 - rangeWidth/2) * vw} y={(height/2 - rectHeight) * vh} width={rangeWidth * vw} height={rectHeight * vh} className={classes.highRect}/>
                    :
                    <rect x={(width/2 - rangeWidth/2) * vw} y={height/2 * vh} width={rangeWidth * vw} height={-rectHeight * vh} className={classes.lowRect}/>
                }


            </g>
        </NodeTips>
    )
}));


const ActionTips = React.memo(({ioValue, vcValue, ...props}) => {
    const tipClasses = useTipStyles();
    return <Tooltip title={<table className={tipClasses.tipTable}>
        <tbody>
        <tr>
            <th>Vasopressor:</th>
            <td>{vcValue}</td>
        </tr>
        <tr>
            <th>Intravenous fluid:</th>
            <td>{ioValue}</td>
        </tr>
        </tbody>
    </table>}
                    {...props}/>

})

const ActionNode = inject('d')(observer(({
    d,
    vw,
    vh,
    width,
    height,
    data,
    selectNode,
    onClick,
    onDoubleClick,
}) => {

    const [hoverHighlight, setHoverHighlight] = useState(false);
    const clickHighlight = !!selectNode && selectNode && d.actionSequence !== null && d.actionSequence === data.action;

    const gridWidth = width / 5 * vw;
    const gridHeight = height / 2 * vh;


    const action = data.action + 1;
    const action1 = Math.floor((action - 0.0001) / 5) + 1;
    const action2 = action - Math.floor(action / 5) * 5;


    const classes = useActionStyles({
        actionColor: d.actionColor,
        gridWidth,
        gridHeight,
        highlight: 'rgb(212,78,64)'
    });

    function ActionRect() {
        return <g
            onMouseEnter={() => {
                // setHoverHighlight(true)
            }}
            onMouseLeave={() => {
                // setHoverHighlight(false)
            }}
            onDoubleClick={() => {
                !!onDoubleClick && onDoubleClick();
            }}
            onContextMenu={() => {
                !!onClick && onClick();
            }}
            filter={hoverHighlight ? 'url(#lightShadow)' : ''}
        >
            <rect width={width * vw} height={height * vh / 2} className={classes.grid}/>
            <rect transform={`translate(${0}, ${height * vh / 2})`} width={width * vw} height={height * vh / 2} className={classes.grid}/>
            {[0,1,2,3,4].map(idx => (
                <g key={idx} transform={`translate(${gridWidth * idx}, ${0})`} key={idx}>
                    <rect key={`${idx},${0}`} width={gridWidth} height={gridHeight}
                          className={clsx(classes.outerGrid)}
                    />
                    <rect key={`inner${idx},${0}`} className={clsx(classes.innerGrid, {
                        [classes.blankGrid]: idx >= action1,
                        [classes.action1Grid]: idx < action1,
                    })}/>
                </g>
            ))}
            {[0,1,2,3,4].map(idx => (
                <g key={idx} transform={`translate(${gridWidth * idx}, ${gridHeight})`} key={idx}>
                    <rect key={`${idx},${1}`} width={gridWidth} height={gridHeight}
                          className={clsx(classes.outerGrid)}
                    />
                    <rect key={`inner${idx},${1}`} className={clsx(classes.innerGrid, {
                        [classes.blankGrid]: idx >= action2,
                        [classes.action2Grid]: idx < action2,
                    })}/>
                </g>
            ))}
            <rect width={width * vw} height={height * vh} className={clsx(classes.stroke, {
                [classes.selected]: clickHighlight
            })}/>
        </g>
    }

    return (!!data.action_real ? <ActionTips ioValue={data.action_real[0]} vcValue={data.action_real[1]}>
        <ActionRect/>
    </ActionTips> : <ActionRect/>)
}));

export {GridNode, RangeNode, ActionNode};
