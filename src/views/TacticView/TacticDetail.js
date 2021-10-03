/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useMemo} from 'react';
import {inject, observer} from 'mobx-react';
import {darken, lighten, makeStyles, Tooltip, Typography} from '@material-ui/core';
import {green} from "@material-ui/core/colors";
import {ArrowRightAlt} from '@material-ui/icons';
import clsx from "clsx";

const useValueStyles = makeStyles(theme => ({
    capsule: {
        minWidth: 200,
        maxWidth: 300,
        width: '90%',
        margin: '0 auto',
        height: '90%',
        borderRadius: 500,
        padding: '0 25px',
        borderWidth: 4,
        borderStyle: 'solid',
    },
    compareCapsule: {
        position: 'relative',
        minWidth: 400,
        maxWidth: 600,
        width: '90%',
        borderRadius: 500,
        margin: '0 auto',
        height: '90%',
        display: 'flex',
        justifyContent: 'space-between',
    },
    highlightCompare: {
        // border: `4px solid ${theme.palette.secondary.main}`,
        '& $player': {
            borderColor: props => props.playerColor[0],
            // boxShadow: props => `0 0 6px 1px ${props.playerColor[0]}`,
        },
        '& $opponent': {
            borderColor: props => props.playerColor[1],
            // boxShadow: props => `0 0 6px 1px ${props.playerColor[1]}`,
        }
    },
    leftCapsule: {
        borderRadius: '500px 0 0 500px',
        width: 'calc(50% - 1px)',
        height: '100%',
        paddingLeft: 25,
        borderWidth: 4,
        borderStyle: 'solid',
    },
    rightCapsule: {
        borderRadius: '0 500px 500px 0',
        width: 'calc(50% - 1px)',
        height: '100%',
        paddingRight: 25,
        borderWidth: 4,
        borderStyle: 'solid',
    },
    empty: {
        borderStyle: 'dotted',
    },
    value: {
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    singleValue: {
        fontSize: 20,
    },
    barTrack: {
        width: '100%',
        height: theme.spacing(1),
        backgroundColor: theme.palette.background.default,
        borderRadius: theme.spacing(0.5),
    },
    bar: {
        height: theme.spacing(1),
        backgroundColor: darken(theme.palette.background.default, 0.7),
        borderRadius: theme.spacing(0.5),
    },
    tableContainer: {
        width: '100%',
        height: 24,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    valueTable: {
        width: '100%',
        height: 0,
        tableLayout: 'fixed',
        '& th': {
            width: 120,
            textOverflow: 'ellipsis',
            overflow: 'hidden',
            padding: '0 3px',
            textAlign: 'right',
            whiteSpace: 'nowrap',
        },
        '& td': {
            padding: 0,
        }
    },
    player: {
        borderColor: props => lighten(props.playerColor[0], 0.55),
    },
    opponent: {
        borderColor: props => lighten(props.playerColor[1], 0.55),
    },
    connect: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: 30,
        height: 30,
        fontSize: 24,
        textAlign: 'center',
        lineHeight: '30px',
        backgroundColor: green['500'],
        transform: 'translate(-50%, -50%)',
        color: 'white',
        borderRadius: '50%',
    },
}));

const getValueState = (d, t, aIdx, eIdx) => {
    const evts = t.events;
    const evt = evts[eIdx];
    const seq_idx = t.sequences_idx[0];
    // const server = (seq.events.length + seq.winner + 1) % 2;
    const server = 0;

    if (!evt) return {
        exist: false,
        playerIdx: (server + eIdx + seq_idx[1]) % 2,
    };

    // const seq = d.data.sequences[seq_idx[0]];
    const val = evt[aIdx];
    if (val !== null) return {
        exist: true,
        playerIdx: (server + seq_idx[eIdx + 1]) % 2,
        aIdx,
        values: [
            {value: val, frequency: t.sequences_idx.length},
        ],
    };

    const seqIdxes = (d.focusedNode === null) ? (t.sequences_idx) : (d.data.flow.nodes.reduce((p, c) => c.key === d.focusedNode ? c.tactic_pos : p, []));
    const values = {};
    for (const seq_idx of seqIdxes) {
        const seq = d.data.sequences[seq_idx[0]];
        if (!seq) continue;
        const evt = seq.events[seq_idx[eIdx + 1]];
        if (!evt) continue;
        const val = evt[aIdx];
        if (!val) continue;
        if (!values.hasOwnProperty(val)) values[val] = 1;
        else values[val]++;
    }
    return {
        exist: true,
        playerIdx: (server + seq_idx[eIdx + 1]) % 2,
        all: seqIdxes.length,
        aIdx,
        values: Object.entries(values)
            .sort((a, b) => b[1] - a[1])
            .map((d) => ({
                value: parseInt(d[0]),
                frequency: d[1],
            })), // array of {value:"", frequency: 0}
    }
};

const valueName = (d, aIdx, vIdx) => {
    const values = d.data.values;
    const name = values[aIdx][vIdx];
    return name.endsWith('Op') ? name.substr(0, name.length - 2) : name;
};

const Value = inject('d')(observer(function ({d, valueState}) {
    const classes = useValueStyles({playerColor: d.playerColor});
    if (valueState.values.length === 1)
        return <div className={classes.value}>
            <Typography
                className={classes.singleValue}>{valueName(d, valueState.aIdx, valueState.values[0].value)}</Typography>
        </div>;
    return <div className={classes.value}>
        <div className={classes.tableContainer}>
            <table className={classes.valueTable}>
                <tbody>
                {valueState.values.slice(0, 3).map((value, vId) => {
                    const name = valueName(d, valueState.aIdx, value.value);
                    return <tr key={vId}>
                        <Tooltip title={name}>
                            <th>{name}</th>
                        </Tooltip>
                        <td>
                            <div className={classes.barTrack} title={value.frequency}>
                                <div className={classes.bar}
                                     style={{width: `${value.frequency / valueState.all * 100}%`}}/>
                            </div>
                        </td>
                    </tr>
                })}
                </tbody>
            </table>
        </div>
    </div>;
}));

const SingleValue = inject('d')(observer(function ({d, t1, aIdx, eIdx}) {
    const classes = useValueStyles({playerColor: d.playerColor});
    const valueState = getValueState(d, t1, aIdx, eIdx);
    return <div className={clsx(classes.capsule, valueState.playerIdx ? classes.opponent : classes.player)}>
        <Value valueState={valueState}/>
    </div>
}));

const CompareValue = inject('d')(observer(function ({d, t1, t2, aIdx, eIdx, align}) {
    const classes = useValueStyles({playerColor: d.playerColor});
    const valueState1 = getValueState(d, t1, aIdx, eIdx + (align === -1 ? -1 : 0)),
        valueState2 = getValueState(d, t2, aIdx, eIdx + (align === 1 ? -1 : 0));
    const isSame = valueState1.exist &&
        valueState2.exist &&
        valueState1.playerIdx === valueState2.playerIdx &&
        valueState1.values.length === valueState2.values.length &&
        (valueState1.values[0].value === valueState2.values[0].value &&
            (valueState1.values.length < 2 || valueState1.values[1].value === valueState2.values[1].value));
    if (aIdx === 2 && eIdx === 1) console.log(isSame, valueState1.values, valueState2.values);
    return <div className={clsx(classes.compareCapsule, {
        [classes.highlightCompare]: isSame,
    })}>
        {!valueState1.exist ? <div
                className={clsx(classes.leftCapsule, classes.empty, valueState1.playerIdx ? classes.opponent : classes.player)}/> :
            <div className={clsx(classes.leftCapsule, valueState1.playerIdx ? classes.opponent : classes.player)}>
                <Value valueState={valueState1}/>
            </div>}
        {isSame && <div className={classes.connect}>=</div>}
        {!valueState2.exist ? <div
                className={clsx(classes.rightCapsule, classes.empty, valueState2.playerIdx ? classes.opponent : classes.player)}/> :
            <div className={clsx(classes.rightCapsule, valueState2.playerIdx ? classes.opponent : classes.player)}>
                <Value valueState={valueState2}/>
            </div>}
    </div>
}));

const useTacticDetailStyles = makeStyles(theme => ({
    table: {
        margin: theme.spacing(1),
        height: `calc(100% - ${theme.spacing(2)}px)`,
        width: `calc(100% - ${theme.spacing(2)}px)`,
        position: 'relative',
        '& > * > * > th': {
            width: 100,
            textAlign: 'right'
        },
        '& td$arrow': {
            width: 40,
            textAlign: 'center',
        },
    },
    arrow: {
        flex: 1,
    }
}));

const useAlign = (d, t1, t2) => {
    // -1: t1 后移
    // 0: 不动
    // 1: t2后移
    return useMemo(() => {
        if (!t2) return 0;
        // const seqs = d.data.sequences;
        const seqIdx1 = t1.sequences_idx[0], seqIdx2 = t2.sequences_idx[0];
        // const seq1 = seqs[seqIdx1[0]], seq2 = seqs[seqIdx2[0]];
        const server1 = 0, server2 = 0;
        const p1 = (server1 + seqIdx1[1]) % 2, p2 = (server2 + seqIdx2[1]) % 2;
        if (p1 === p2) return 0;
        if (t1.events.length < t2.events.length) return -1;
        else return 1;
    }, [t1.events.length, t1.sequences_idx, t2]);
};

export default inject('d')(observer(function TacticDetail({d, t1, t2}) {
    const classes = useTacticDetailStyles();
    const align = useAlign(d, t1, t2);
    const size1 = t1.events.length, size2 = (!t2) ? 0 : t2.events.length;
    const maxSize = Math.max(size1 + (align === -1 ? 1 : 0), size2 + (align === 1 ? 1 : 0));
    const attrs = d.data.attributes || [];

    return <table className={classes.table}>
        <tbody>
        {attrs.map((attr, aIdx) => {
            return <tr key={attr}>
                <th>{attr}</th>
                {[...new Array(maxSize)].map((_, eIdx) => {
                    return <React.Fragment key={eIdx}>
                        {/* arrow */}
                        {eIdx !== 0 && <td className={classes.arrow}><ArrowRightAlt/></td>}
                        {/*  value */}
                        <td>
                            {
                                !t2 ?
                                    <SingleValue t1={t1} aIdx={aIdx} eIdx={eIdx}/> :
                                    <CompareValue t1={t1} t2={t2} aIdx={aIdx} eIdx={eIdx} align={align}/>
                            }
                        </td>
                    </React.Fragment>
                })}
            </tr>;
        })}
        </tbody>
    </table>;
}));
