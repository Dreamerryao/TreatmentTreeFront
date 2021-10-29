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
        {/*<div className={classes.placeholder}/>*/}
        {/*<MySelect title={'Predict Record'}*/}
        {/*          value={initialRecord}*/}
        {/*          onChange={setInitialRecord}*/}
        {/*          options={allInitialRecord}>*/}
        {/*</MySelect>*/}
        {/*<Button className={classes.action}*/}
        {/*        disabled={!isModified}*/}
        {/*        color={'secondary'}*/}
        {/*        onClick={onCancel}>*/}
        {/*    <Close/>*/}
        {/*</Button>*/}
        {/*<Button className={classes.action}*/}
        {/*        disabled={!isModified}*/}
        {/*        color={'primary'}*/}
        {/*        onClick={onSubmit}>*/}
        {/*    <Check/>*/}
        {/*</Button>*/}
    </div>;
}));