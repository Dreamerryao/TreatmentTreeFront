/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useMemo, useState} from "react";
import {createStyles, makeStyles, Tooltip} from "@material-ui/core";
import useRateColor from "../../utils/hooks/FlowView/useColor";
import {inject, observer} from "mobx-react";
import clsx from "clsx";
import useDataFilter from "../../utils/hooks/FlowView/useDataFilter";

const useStyles = makeStyles(theme => ({
    root: {},
    point: {
        fill: ({color}) => !!color ? color : 'rgb(133, 133, 133)',
        fillOpacity: 0.8,
        stroke: "black",
        strokeWidth: "0.5",
    },
    selectedPoint: {
        stroke: props => props.highlight[0],
        strokeWidth: 4,
    },
    comparedPoint: {
        stroke: props => props.highlight[1],
        strokeWidth: 4,
    },
}));

const useTipStyle = makeStyles(() => createStyles({
    tooltip: {
        maxWidth: 'none',
    },
    tipTable: {
        '& > tbody > tr > th': {
            textAlign: 'right'
        },
        '& > tbody > tr > td': {
            textAlign: 'left'
        },
    }
}));

const Tips = ({frequency, winning, nodeCount, ...props}) => {
    const classes = useTipStyle();
    return <Tooltip classes={{tooltip: classes.tooltip}}
                    title={<table className={classes.tipTable}>
                        <tbody>
                        <tr>
                            <th>Frequency:</th>
                            <td>{frequency}</td>
                        </tr>
                        <tr>
                            <th>Winning Rate:</th>
                            <td>
                                {winning[0]} ({Math.round(winning[0] / (winning[0] + winning[1]) * 1000) / 10}%)
                                - {winning[1]} ({Math.round(winning[1] / (winning[0] + winning[1]) * 1000) / 10}%)
                            </td>
                        </tr>
                        <tr>
                            <th>Node Count:</th>
                            <td>{nodeCount}</td>
                        </tr>
                        </tbody>
                    </table>}
                    {...props}/>
};

function ProjectionPoint({
                                            d,
                                            tactic,
                                            data,
                                            playerColor,
                                            maxX, maxY, minX, minY,
                                            tId,
                                            vw, vh,
                                            onClick,
                                            onContextMenu,
}) {
    const [hovered, setHovered] = useState(false);
    const filterFlow = useDataFilter(Object.keys(d.data).length !== 0 ? d.data.flow.nodes : [],
        Object.keys(d.data).length !== 0 ? d.data.flow.links : [],
        d.similarBar, d.frequencyBar,
        Object.keys(d.data).length !== 0 ? d.data.sequences : [],
        d.data.tactics);
    // const frequency = tactic.sequences_idx.length;
    const frequency = useMemo(() => filterFlow.nodes.reduce((sum, node) => {
        if (node.tactic === tId) {
            return sum + node.frequency;
        }
        return sum;
    }, 0), [filterFlow.nodes, tId]);
    const nodeCount = useMemo(() => filterFlow.nodes.reduce((sum, node) => {
        if (node.tactic === tId) {
            return sum + 1;
        }
        return sum;
    }, 0), [filterFlow.nodes, tId]);

    // const winning = tactic.sequences_idx.map(seqIdxs => data.sequences[seqIdxs[0]].winner).reduce((sum, a) => {
    //     return sum + a;
    // }, 0);
    const winning = filterFlow.nodes.reduce((sum, node) => {
        if (node.tactic === tId) {
            return sum + node.winning;
        }
        return sum;
    }, 0);
    const winningRate = winning / frequency;
    const color = useRateColor(winningRate - 0.5, playerColor)
    const isSelected = useMemo(() => d.focusedTactic === tId, [d.focusedTactic, tId]);
    const isCompared = useMemo(() => d.comparedTactic === tId, [d.comparedTactic, tId]);
    const ra = Math.log(frequency + 2) * 2;

    const classes = useStyles({color, highlight: d.highlight});
    // console.log((tactic['point'][0] - minX) / (maxX - minX) * vw)
    return frequency !== 0 ?
        <Tips frequency={frequency} winning={[winning, frequency - winning]} nodeCount={nodeCount}>
            <g>
                <circle cx={(tactic['point'][0] - minX) / (maxX - minX) * vw}
                        cy={(tactic['point'][1] - minY) / (maxY - minY) * vh}
                        r={ra}
                        onClick={() => {
                            !!onClick && onClick()
                            console.log('click on tactic: ', tId, d.focusedTactic, tactic)
                        }}
                        onMouseEnter={() => {
                            setHovered(true);
                        }}
                        onMouseLeave={() => {
                            setHovered(false);
                        }}
                        onContextMenu={() => {
                            !!onContextMenu && onContextMenu()
                        }}
                        filter={hovered ? 'url(#lightShadow)' : ''}
                        className={clsx(classes.point, {
                            [classes.selectedPoint]: isSelected,
                            [classes.comparedPoint]: isCompared,
                        })}/>
            </g>
        </Tips> : null;

}
export default inject('d')(observer(ProjectionPoint));
