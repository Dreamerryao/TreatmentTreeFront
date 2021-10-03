/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React from 'react';
import {makeStyles} from "@material-ui/core";
import clsx from "clsx";

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        height: '100%',
    },
    container: {
        display: 'flex',
        flexDirection: ({direction}) => direction,
        "& > $item": {
            width: ({direction}) => direction === 'row' ? undefined : '100%',
            height: ({direction}) => direction === 'column' ? undefined : '100%',
        },
        "& > $pad": {
            width: ({direction}) => direction === 'row' ? undefined : '100%',
            height: ({direction}) => direction === 'column' ? undefined : '100%',
        }
    },
    leaf: {
        border: 'dashed rgb(133,133,133)',
    },
    item: {
        flexBasis: ({size}) => size === 0 ? undefined : 0,
        overflow: 'hidden',
        flexGrow: ({size}) => size,
        flexShrink: ({size}) => size,
    },
    pad: {},
    sPad: {
        flexGrow: 0,
        flexShrink: 0,
        width: ({padding, direction}) => (direction === 'row') ? padding[0] * 10 : undefined,
        height: ({padding, direction}) => (direction !== 'row') ? padding[0] * 10 : undefined,
    },
    mPad: {
        flexGrow: 0,
        flexShrink: 0,
        width: ({padding, direction}) => (direction === 'row') ? padding[1] * 10 : undefined,
        height: ({padding, direction}) => (direction !== 'row') ? padding[1] * 10 : undefined,
    },
    ePad: {
        flexGrow: 0,
        flexShrink: 0,
        width: ({padding, direction}) => (direction === 'row') ? padding[2] * 10 : undefined,
        height: ({padding, direction}) => (direction !== 'row') ? padding[2] * 10 : undefined,
    },
}));

function Layout({direction = 'row', size = 1, root=false, container = false, padding = 0, children = null, leaf=false}) {
    const pad = (typeof(padding) === 'number') ? [padding, padding, padding] : padding;
    const classes = useStyles({direction, size, padding: pad});

    const arr = children === null ? [] : (children instanceof Array ? children.map(d => d) : [children]);
    if (pad[1] !== 0)
        for (let i = arr.length - 1; i > 0; i--) arr.splice(i, 0, <div key={`cPad${i}`} className={clsx(classes.pad, classes.mPad)}/>);
    if (pad[0] !== 0) arr.splice(0, 0, <div key="sPad" className={clsx(classes.pad, classes.sPad)}/>);
    if (pad[2] !== 0) arr.splice(arr.length, 0, <div key="ePad" className={clsx(classes.pad, classes.ePad)}/>);

    return <div className={clsx(classes.item, {
        [classes.root]: root,
        [classes.container]: container,
        [classes.leaf]: leaf,
    })}>
        {arr}
    </div>;
}

export default Layout;
