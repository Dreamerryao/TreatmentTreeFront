import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, Dialog, makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import clsx from "clsx";
import useSizeWithDefaultSize from "../../utils/hooks/useSize";
import parseRateColor from "../../utils/parseRateColor";
// import {ArrowBackIosNewIcon, ArrowForwardIosIcon} from "@mui/icons-material/";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import {ActionNode} from "../FlowView/GridNode";

const useStyles = makeStyles(theme => ({
    root: {
        height: '100%',
        position: 'relative',
        overflowX: 'auto',
        overflowY: 'auto',
        '&::-webkit-scrollbar': {
            height: 5,
        },
        '&:hover': {
            visibility: 'visible',
        }
    },
    valueAlign: {
        border: '1px dotted rgb(212,78,64)',

    },
    table: {
        marginTop: 10,
        tableLayout: 'fixed',
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
    sequence: {
        display: 'flex',
        marginTop: 5,
        marginBottom: 5,
        cursor:'pointer'
    },
    sequenceBlank: {
        background: 'rgb(255,255,255)'
    },
    sequenceValue: {
        display: 'flex'
    },
}));

export default inject('d')(observer(function SequenceView({d}) {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);
    const [occurPos, setOccurPos] = useState(0);

    const occurSequences = d.getSequences();
    const maxOccur = occurSequences.reduce((maxOccur, {occur}) => Math.max(maxOccur, occur[0]), 0);

    const maxOccurSize = occurSequences.reduce((maxOccur, {occur}) => Math.max(maxOccur, occur.length), 0);

    const classes = useStyles();
    const oneHeight = 20;
    const oneWidth = 20;
    return <Panel title={'Sequence View'} tools={[
        <Button className={classes.action}
                color={'primary'}
                onClick={() => setOccurPos(occurPos > 0 ? occurPos - 1 : occurPos)}
        >
            <ArrowBackIosIcon />
        </Button>,
        <Button className={classes.action}
                color={'primary'}
                onClick={() => setOccurPos(occurPos < maxOccurSize - 1 ? occurPos + 1 : occurPos)}
        >
            <ArrowForwardIosIcon />
        </Button>
    ]}>
        <div ref={ref} className={classes.root}>
            <div className={classes.table}>
                {
                    occurSequences.map(({record, occur, rId}) => {
                        console.log(occur, record, rId)
                        console.log(occurPos < occur.length ? occurPos : (occur.length - 1))
                        return <div key={rId} className={clsx(classes.tbody, classes.tr)}>
                            {
                                Array(maxOccur - occur[occurPos < occur.length ? occurPos : (occur.length - 1)]).fill(0).map(_ =>
                                    <div className={clsx(classes.sequenceBlank, classes.td)} style={{width: oneWidth * 2, height: oneHeight}}/>)
                            }
                            {
                                record['status'].map((status, eId) => {
                                    return <div style={{
                                        border: occur.includes(eId) ? '2px solid rgb(212,78,64)' : '1px solid white',
                                        display: 'flex',
                                        margin: 0,
                                        padding: 0,
                                        width: oneWidth * 2,
                                        height: oneHeight + 5,
                                    }} className={clsx( classes.td)}>
                                         <div key={`${rId},${eId}`}
                                             onClick={()=>{d.initData('MIMIC-IV', rId)}}
                                             style={{
                                                 background: parseRateColor(status.mortality - 0.3 > 0.5 ? 0.5 : status.mortality - 0.3, d.mortalityColor),
                                                 width: oneWidth,
                                                 height: oneHeight,
                                                 border: '1px solid black'
                                             }}/>

                                         <svg width={oneWidth}
                                              height={oneHeight}
                                              style={{border: '1px solid black'}}
                                         >
                                             <ActionNode
                                                 vw={1}
                                                 vh={1}
                                                 width={oneWidth}
                                                 height={oneHeight}
                                                 x={0}
                                                 y={0}
                                                 data={{action: record['actions'][eId]}}/>
                                         </svg>
                                    </div>
                                })
                            }
                        </div>
                    })
                }
            </div>
        </div>
    </Panel>;
}));
