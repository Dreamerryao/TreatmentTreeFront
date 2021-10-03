/*
 * Copyright 2021 Zhejiang University
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

import React, {useEffect, useRef} from "react";
import {createStyles, darken, makeStyles, Tooltip, lighten} from "@material-ui/core";
import {CSSTransition} from 'react-transition-group';
import useFlow from "../../utils/hooks/FlowView/useFlow";
import clsx from "clsx";
import {inject, observer} from "mobx-react";
import useRateColor from "../../utils/hooks/FlowView/useColor";

const useStyles = makeStyles((theme) => createStyles({
    background: {
        fill: ({fillColor}) => fillColor,
        // fillOpacity: 0.5
        fillOpacity: ({backgroundOpacity}) => backgroundOpacity.current,
    },
    realActionBackground: {
        fill:lighten('rgb(78,131,237)', 0),
        stroke: 'rgb(78,131,237)',
        fillOpacity: 0.5,
    },
    highlightBackground: {
        fill: ({mortalityColor}) => mortalityColor,
        stroke: ({mortalityColor}) => darken(mortalityColor, 0.5),
        fillOpacity: 1,
    },
}));


const Link = ({
                  d,
                  vw,
                  vh,
                  data,
                  branchRoot,
                  branchColorMap,
                  sourcePoint1,
                  sourcePoint2,
                  targetPoint1,
                  targetPoint2,
                  width,
                  sourceNode,
                  targetNode,
                  renderLink,
                  onClick,
                  onHover,
                  onUnhover,
                  isReal,
              }) => {
    const targetMidPoint = [(targetPoint1[0] + targetPoint2[0]) / 2, (targetPoint1[1] + targetPoint2[1]) / 2];
    // const path = useFlow(sourcePoint1, sourcePoint2, [targetPoint1[0], targetMidPoint[1] - width / 2], [targetPoint2[0], targetMidPoint[1] + width / 2], vw, vh);
    const path = useFlow(sourcePoint1, sourcePoint2, targetPoint1, targetPoint2, vw, vh);
    const mortalityColor = useRateColor(targetNode.data.mortality - 0.3 > 0.5 ? 0.5 : targetNode.data.mortality - 0.3, d.mortalityColor)

    const backgroundOpacity = useRef(0);

    let animationName = `animation${Math.round(Math.random() * 100)}`;
    let keyframes =
        `@keyframes ${animationName} {
        0% {fill-opacity: ${backgroundOpacity.current}}
        100% {fill-opacity: 0.5}
    }`;
    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    useEffect(() => {
        // return () => {
        backgroundOpacity.current = 0.2;
        // }
    })

    const classes = useStyles({mortalityColor, fillColor: branchColorMap[branchRoot], backgroundOpacity});
    return (
            <g onClick={() => {!!onClick && onClick();}}
               onMouseEnter={() => {!!onHover && !isReal && onHover()}}
               onMouseLeave={() => !!onUnhover && onUnhover()}>
                <defs>
                    <filter id="linkShadow" x={'-50%'} y={'-50%'} width="200%" height="200%">
                        <feOffset result="offOut" in="SourceAlpha" dx="0" dy="0"/>
                        <feGaussianBlur result="blurOut" in="offOut" stdDeviation="5"/>
                        <feBlend in="SourceGraphic" in2="blurOut" mode="normal"/>
                    </filter>
                </defs>
                <path d={path}
                      style={//!!data.new ? {transition: 'opacity 3s ease-in'} :
                          {transition: 'd 2s', d: `path("${path}")`, animation: `${animationName} 1s linear 1 1.5s forwards`}}
                      className={isReal ? classes.realActionBackground : classes.background}
                />
                {branchRoot === d.highlightBranchRoot && !isReal ?
                    <path d={path}
                          className={classes.highlightBackground}
                    /> : null}
            </g>);
};

export default inject('d')(observer(Link));
