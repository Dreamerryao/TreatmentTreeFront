/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback, useMemo, useRef} from 'react';
import {inject, observer} from 'mobx-react';
import {makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import useSizeWithDefaultSize from "../../utils/hooks/useSize";
import ProjectionPoint from "./ProjectionPoint";
import {MortalityRatePanel} from "../FlowView/FlowViewPanel";

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
    return <Panel title={'Projection View'}>
        <div></div>
    </Panel>;
}));
