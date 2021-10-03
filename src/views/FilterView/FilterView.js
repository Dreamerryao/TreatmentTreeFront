
import React, {useCallback, useMemo, useRef} from 'react';
import {inject, observer} from 'mobx-react';
import {makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";

const useStyles = makeStyles(theme => ({
    text: {
        fontSize: 10,
        height: 32,
        lineHeight: '32px',
    },
    colorLegend: {
        width: 100,
        height: '100%',
    },
    frequencyLegend: {
        width: 20,
        height: 20,
        marginTop: 6,
        borderRadius: '50%',
        backgroundColor: 'white',
        border: `0.5px solid black`,
    },
    toolSeparator: {
        height: 32,
        lineHeight: '32px',
        margin: theme.spacing(0, 1),
    },
}));

export default inject('d')(observer(function ({d}) {

    const classes = useStyles();
    return <Panel title={'Filter View'}>
        <div></div>
    </Panel>;
}));
