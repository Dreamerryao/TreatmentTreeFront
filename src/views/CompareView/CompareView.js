import React from 'react';
import {inject, observer} from 'mobx-react';
import {makeStyles, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import {green} from "@material-ui/core/colors";

const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%',
        overflow: 'auto',
    }
}));

export default inject('d')(observer(function CompareView({d}) {
    const classes = useStyles();
    return <Panel>
        <div>
        </div>
    </Panel>;
}));
