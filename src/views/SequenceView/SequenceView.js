import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {Dialog, makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import clsx from "clsx";
import useSizeWithDefaultSize from "../../utils/hooks/useSize";

const useStyles = makeStyles(theme => ({
}));

export default inject('d')(observer(function SequenceView({d}) {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);


    const classes = useStyles();
    return <Panel title={'Attribute View'}>
        <div ref={ref} style={{width: '100%', height: '100%'}}>

        </div>
    </Panel>;
}));
