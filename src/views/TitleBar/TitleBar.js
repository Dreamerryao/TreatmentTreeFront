/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback} from 'react';
import {inject, observer} from 'mobx-react';
import {Button, makeStyles, Typography} from '@material-ui/core';
import {Check, Close} from "@material-ui/icons";
import usePlayer from "./usePlayer";
import MySelect from "./MySelect";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    titleBar: {
        borderRadius: `0 0 ${theme.shape.borderRadius}px ${theme.shape.borderRadius}px`,
        background: theme.palette.background.paper,
        width: '100%',
        padding: theme.spacing(0.5, 3),
        display: 'flex',
    },
    placeholder: {
        flex: 1,
    },
    rect: {
        width: 20,
        height: 20,
        margin: 6,
    },
    action: {
        minWidth: 0,
        height: 32,
        width: 32,
    },
    sequenceCount: {
        lineHeight: '32px',
        marginRight: theme.spacing(5),
    }
}));

export default inject('d')(observer(function TitleBar({d}) {
    const classes = useStyles();
    console.log('refresh title bar')
    const {
        onCancel, onSubmit,
        dataset, initialRecord,
        allDataset, allInitialRecord,
        setDataset, setInitialRecord,
        isModified
    } = usePlayer(d, d.recordsIndex);

    return <div className={classes.titleBar}>
        <Typography variant={"h6"}>TreatmentTree</Typography>
        <div className={classes.placeholder}/>
        <MySelect title={'Dataset'}
                  value={dataset}
                  onChange={setDataset}
                  options={allDataset}>
        </MySelect>
        <div className={classes.placeholder}/>
        <MySelect title={'Predict Record'}
                  value={initialRecord}
                  onChange={setInitialRecord}
                  options={allInitialRecord}>
        </MySelect>
        <Button className={classes.action}
                disabled={!isModified}
                color={'secondary'}
                onClick={onCancel}>
            <Close/>
        </Button>
        <Button className={classes.action}
                disabled={!isModified}
                color={'primary'}
                onClick={onSubmit}>
            <Check/>
        </Button>
    </div>;
}));