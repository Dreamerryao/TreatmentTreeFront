import React, { useCallback, useEffect, useMemo, useState, useRef } from "react";

const toRealScale = (scaleLevel) => scaleLevel < 0 ? 1 / (1 - scaleLevel) : 1 + scaleLevel;
const toRealativeScale = (v) => v < 1 ? (v - 1) / v : v - 1;

export default function useCamera(svgEle, width, height, rectEle) {
    const [dragAnchor, setDragAnchor] = useState(null);
    const [rectDragAnchor, setRectDragAnchor] = useState(null);

    const [cursor, setCursor] = useState(null);
    const [rectCursor, setRectCursor] = useState(null);

    const [viewX, setViewX] = useState(0);
    const [viewY, setViewY] = useState(0);
    const [scaleLevel, setScaleLevel] = useState(0);
    // 最小scale
    const initScale = useRef(1);
    const realScale = toRealScale(scaleLevel);

    //tricky 右上角相对于本身的比例 
    const m_scale = useRef(isNaN(100 / height) ? 1 : 100 / height);
    useEffect(() => {
        m_scale.current = isNaN(100 / height) ? 1 : 100 / height;
    }, [height])

    const [offsetX, offsetY] = useMemo(() => {
        if (cursor === null || dragAnchor === null) return [0, 0];

        let offsetX = (cursor[0] - dragAnchor[0]) / realScale, offsetY = (cursor[1] - dragAnchor[1]) / realScale;
        return [offsetX, offsetY]
    }, [cursor, dragAnchor, realScale])

    const [rectOffsetX, rectOffsetY] = useMemo(() => {
        if (rectCursor === null || rectDragAnchor === null) return [0, 0];

        let offsetX = -(rectCursor[0] - rectDragAnchor[0]) / m_scale.current / initScale.current, offsetY = -(rectCursor[1] - rectDragAnchor[1]) / m_scale.current / initScale.current;
        return [offsetX, offsetY]
    }, [rectCursor, rectDragAnchor, realScale])



    const handleDragStart = useCallback((e) => {
        setDragAnchor([e.clientX, e.clientY]);
        setCursor([e.clientX, e.clientY]);
    }, [])

    const handleRectDragStart = useCallback((e) => {
        e.stopPropagation();
        setRectDragAnchor([e.clientX, e.clientY]);
        setRectCursor([e.clientX, e.clientY]);
    }, [])

    const handleDrag = useCallback((e) => {
        if (dragAnchor === null) return;

        setCursor([e.clientX, e.clientY]);
    }, [dragAnchor])

    const handleRectDrag = useCallback((e) => {
        if (rectDragAnchor === null) return;
        e.stopPropagation();
        setRectCursor([e.clientX, e.clientY]);
    }, [rectDragAnchor])

    const handleDragEnd = useCallback((e) => {
        setViewX(viewX - offsetX);
        setViewY(viewY - offsetY);
        setDragAnchor(null);
        setCursor(null);
    }, [offsetX, offsetY, viewX, viewY]);

    const handleRectDragEnd = useCallback((e) => {
        e.stopPropagation();
        setViewX(viewX - rectOffsetX);
        setViewY(viewY - rectOffsetY);
        setRectCursor(null);
        setRectDragAnchor(null);
    }, [rectOffsetY, rectOffsetX, viewX, viewY]);
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

    useEffect(() => {
        const ele = rectEle.current;
        ele.addEventListener('mousedown', handleRectDragStart);
        ele.addEventListener('mousemove', handleRectDrag);
        ele.addEventListener('mouseup', handleRectDragEnd);
        return () => {
            ele.removeEventListener('mousedown', handleRectDragStart);
            ele.removeEventListener('mousemove', handleRectDrag);
            ele.removeEventListener('mouseup', handleRectDragEnd);
        }
    }, [handleRectDrag, handleRectDragEnd, handleRectDragStart, rectEle])

    const viewW = width / realScale, viewH = height / realScale;
    const handleWheel = useCallback((e) => {
        const newScaleLevel = e.deltaY < 0 ? scaleLevel + 0.05 : scaleLevel - 0.05;
        const oldRealScale = toRealScale(scaleLevel);
        const newRealScale = toRealScale(newScaleLevel);
        // 限制最小scale
        if (newRealScale >= initScale.current - 0.05) {
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
        initScale.current = newV;
    }
    const reset = () => {
        setViewX(0);
        setViewY(0);
        setScaleLevel(0);
    }

    return {
        viewX: viewX - offsetX - rectOffsetX,
        viewY: viewY - offsetY - rectOffsetY,
        viewW,
        viewH,
        scale: realScale,
        reset,
        handleChangeScaleLevel
    }
}
