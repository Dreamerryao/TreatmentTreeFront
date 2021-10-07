import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";

const toRealScale = (scaleLevel) => scaleLevel < 0 ? 1 / (1 - scaleLevel) : 1 + scaleLevel;
const toRealativeScale = (v) => v < 1 ? (v - 1) / v : v - 1;

export default function useCamera(svgEle, width, height) {
    const [dragAnchor, setDragAnchor] = useState(null);
    const [cursor, setCursor] = useState(null);
    const [viewX, setViewX] = useState(0);
    const [viewY, setViewY] = useState(0);
    const [scaleLevel, setScaleLevel] = useState(0);
    // 最小scale
    const minScale = useRef(0);
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
        const newScaleLevel = e.deltaY < 0 ? scaleLevel + 0.05 : scaleLevel - 0.05;
        const oldRealScale = toRealScale(scaleLevel);
        const newRealScale = toRealScale(newScaleLevel);
        if (newRealScale >= minScale.current) {
            const newViewX = viewX + (viewW - viewW / newRealScale * oldRealScale) * e.offsetX / width;
            const newViewY = viewY + (viewH - viewH / newRealScale * oldRealScale) * e.offsetY / height;

            setScaleLevel(newScaleLevel);
            setViewX(newViewX);
            setViewY(newViewY);
        }
        // else {
        //     alert("不能再缩小了！")
        // }
    }, [height, scaleLevel, viewH, viewW, viewX, viewY, width])
    useEffect(() => {
        const ele = svgEle.current;
        ele.addEventListener('wheel', handleWheel)
        return () => {
            ele.removeEventListener('wheel', handleWheel);
        }
    }, [handleWheel, svgEle])

    const handleChangeScaleLevel = (newV) => {
        const newScaleLevel = toRealativeScale(newV);
        setScaleLevel(newScaleLevel);
        setViewX(0);
        setViewY(0);
        minScale.current = Math.max(newV - 0.05, 0);
    }
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
        reset,
        handleChangeScaleLevel
    }
}
