/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, IconButton, makeStyles, Typography} from '@material-ui/core';
import clsx from "clsx";
import {Videocam} from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
    sequence: {
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'hidden',
        transition: 'height 0.3s ease',
        margin: theme.spacing(0, 1),
        height: 146,
        visibility: 'hidden',
        '&::-webkit-scrollbar': {
            height: 5,
        },
        '&:hover': {
            visibility: 'visible',
        }
    },
    collapse: {
        height: 40,
        '& $table $th': {
            width: 30,
        },
        '& $table $td': {
            width: 30,
        },
    },
    table: {
        transition: 'width 0.3s ease',
        tableLayout: 'fixed',
        borderCollapse: 'collapse',
        visibility: 'visible',
        '& $th': {
            width: 100,
            border: '1px solid white',
            transition: 'width 0.3s ease',
            flexShrink: 0,
            lineHeight: '30px',
        },
        '& $thead $th': {
            lineHeight: '40px',
            textAlign: 'center',
        },
        '& $td': {
            width: 70,
            border: '1px solid white',
            padding: theme.spacing(0.5, 0.2),
            transition: 'width 0.3s ease',
            flexShrink: 0,
        },
        '& $tr': {
            height: 30,
            display: 'flex',
            flexWrap: 'noWrap',
        },
        '& $thead$tr': {
            height: 40,
        },
        '& $tbody $th': {
            textAlign: 'right',
        },
        '& $tbody $td': {
            lineHeight: '30px',
            textAlign: 'center',
            padding: '0 5px',
            color: theme.palette.background.paper
        },
    },
    thead: {},
    tbody: {},
    tr: {},
    th: {},
    td: {},
    evt: {
        width: 25,
        height: 25,
        textAlign: 'center',
        borderRadius: '50%',
        borderWidth: 2,
        borderStyle: 'solid',
        color: theme.palette.background.paper,
        margin: 'auto',
    },
    player: {
        backgroundColor: props => props.playerColor[0],
        borderColor: props => props.playerColor[0],
    },
    opponent: {
        backgroundColor: props => props.playerColor[1],
        borderColor: props => props.playerColor[1],
    },
    notInTactic: {
        backgroundColor: props => theme.palette.background.paper,
        color: theme.palette.getContrastText(theme.palette.background.paper),
        opacity: 0.4,
    },
    win: {
        color: 'green',
        lineHeight: '40px',
    },
    lose: {
        color: 'red',
        lineHeight: '40px',
    },
    videoBtn: {
        position: 'absolute',
        background: 'rgba(255, 255, 255, 0.3)',
        top: 0,
        height: 40,
        right: 0,
        width: 40,
        minWidth: 0,
        '&:hover': {
            background: 'rgba(255, 255, 255, 0.9)',
        }
    }
}));

export default inject('d')(observer(function Sequence({d, seqIdx, onPlayVideo}) {
    const classes = useStyles({playerColor: d.playerColor});
    const [isCollapse, setCollapse] = useState(true);
    const seqs = d.data.sequences || [];
    const seq = seqs[seqIdx[0]];
    const evtIdx = seqIdx.slice(1);
    const attrs = d.data.attributes;
    const vals = d.data.values;
    const toggleCollapse = useCallback(() => {
        setCollapse(d => !d);
    }, []);

    return <div className={clsx(classes.sequence, {
        [classes.collapse]: isCollapse
    })}>
        <div className={classes.table}>
            <div className={clsx(classes.thead, classes.tr)} onClick={toggleCollapse}>
                {/* win lose */}
                <div className={classes.th}>
                    {seq.winner === 1 ?
                        <Typography className={classes.win}>W</Typography> :
                        <Typography className={classes.lose}>L</Typography>}
                </div>
                {/*  all events */}
                {seq.events.map((evt, eId) => {
                    // const server = (seq.winner + seq.events.length + 1) % 2;
                    const server = 0;
                    const player = (server + eId) % 2;
                    return <div className={classes.td} key={eId}>
                        <div className={clsx(classes.evt, {
                            [classes.player]: player === 0,
                            [classes.opponent]: player === 1,
                            [classes.notInTactic]: !evtIdx.includes(eId),
                        })}>{eId}</div>
                    </div>
                })}
            </div>
            {attrs.map((attr, aId) => {
                // if (isCollapse) return <tr className={classes.tr} key={attr}/>;
                return <div className={clsx(classes.tbody, classes.tr)} key={attr}>
                    <div className={classes.th}>{attr}</div>
                    {seq.events.map((evt, eId) => {
                        // const server = (seq.winner + seq.events.length + 1) % 2;
                        const server = 0;
                        const player = (server + eId) % 2;
                        return <div key={eId}
                                    className={clsx(classes.td, player === 0 ? classes.player : classes.opponent)}>
                            {vals[aId][evt[aId]]}
                        </div>;
                    })}
                </div>
            })}
        </div>
        <Button className={classes.videoBtn} size={"small"} onClick={useCallback(() => onPlayVideo(seqIdx), [seqIdx, onPlayVideo])}><Videocam/></Button>
    </div>;
}));
