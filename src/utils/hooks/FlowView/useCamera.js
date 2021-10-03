/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useCallback, useEffect, useMemo, useState} from "react";

const toRealScale = (scaleLevel) => scaleLevel < 0 ? 1 / (1 - scaleLevel) : 1 + scaleLevel;

export default function useCamera(svgEle, width, height) {
    const [dragAnchor, setDragAnchor] = useState(null);
    const [cursor, setCursor] = useState(null);
    const [viewX, setViewX] = useState(0);
    const [viewY, setViewY] = useState(0);
    const [scaleLevel, setScaleLevel] = useState(0);
    const realScale = toRealScale(scaleLevel);

    const [offsetX, offsetY] = useMemo(() => {
        if (cursor === null || dragAnchor === null) return [0, 0];

        let offsetX = (cursor[0] - dragAnchor[0]) / realScale, offsetY = (cursor[1] - dragAnchor[1]) / realScale;
        return [offsetX, offsetY]
    }, [cursor, dragAnchor, realScale])

    const handleDragStart = useCallback((e) => {
        setDragAnchor([e.clientX, e.clientY]);
        setCursor([e.clientX, e.clientY]);
    }, [])
    const handleDrag = useCallback((e) => {
        if (dragAnchor === null) return;
        setCursor([e.clientX, e.clientY]);
    }, [dragAnchor])
    const handleDragEnd = useCallback((e) => {
        setViewX(viewX - offsetX);
        setViewY(viewY - offsetY);
        setDragAnchor(null);
        setCursor(null);
    }, [offsetX, offsetY, viewX, viewY]);
    useEffect(() => {
        const ele = svgEle.current;
        ele.addEventListener('mousedown', handleDragStart);
        ele.addEventListener('mousemove', handleDrag);
        ele.addEventListener('mouseup', handleDragEnd);
        return () => {
            ele.removeEventListener('mousedown', handleDragStart);
            ele.removeEventListener('mousemove', handleDrag);
            ele.removeEventListener('mouseup', handleDragEnd);
        }
    }, [handleDrag, handleDragEnd, handleDragStart, svgEle])

    const viewW = width / realScale, viewH = height / realScale;
    const handleWheel = useCallback((e) => {
        const newScaleLevel = e.deltaY < 0 ? scaleLevel + 0.5 : scaleLevel - 0.5;

        const oldRealScale = toRealScale(scaleLevel);
        const newRealScale = toRealScale(newScaleLevel);
        const newViewX = viewX + (viewW - viewW / newRealScale * oldRealScale) * e.offsetX / width;
        const newViewY = viewY + (viewH - viewH / newRealScale * oldRealScale) * e.offsetY / height;

        setScaleLevel(newScaleLevel);
        setViewX(newViewX);
        setViewY(newViewY);
    }, [height, scaleLevel, viewH, viewW, viewX, viewY, width])
    useEffect(() => {
        const ele = svgEle.current;
        ele.addEventListener('wheel', handleWheel)
        return () => {
            ele.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel, svgEle])

    const reset = () => {
        setViewX(0);
        setViewY(0);
        setScaleLevel(0);
    }

    return {
        viewX: viewX - offsetX,
        viewY: viewY - offsetY,
        viewW,
        viewH,
        scale: realScale,
        reset
    }
}
