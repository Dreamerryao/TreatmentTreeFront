/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {Dialog, makeStyles, Tooltip, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import Sequence from "./Sequence";
import clsx from "clsx";
import {useVirtualList} from "ahooks";
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
