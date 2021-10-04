import React, {useCallback, useMemo, useRef} from 'react';
import {inject, observer} from 'mobx-react';
import {makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";

const useStyles = makeStyles(theme => ({
}));

export default inject('d')(observer(function ({d}) {

    const classes = useStyles();
    return <Panel title={'Projection View'}>
        <div></div>
    </Panel>;
}));
