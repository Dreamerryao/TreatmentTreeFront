import React, {useEffect, useRef} from "react";
import {createStyles, darken, makeStyles, Tooltip, lighten} from "@material-ui/core";
import {CSSTransition} from 'react-transition-group';
import useFlow from "../../utils/hooks/FlowView/useFlow";
import clsx from "clsx";
import {inject, observer} from "mobx-react";
import getRateColor from "../../utils/hooks/FlowView/useColor";

const useStyles = makeStyles((theme) => createStyles({
    background: {
        fill: ({fillColor}) => fillColor,
        // fillOpacity: 0.5
        fillOpacity: ({backgroundOpacity}) => backgroundOpacity.current,
    },
    realActionBackground: {
        fill:lighten('rgb(78,131,237)', 0),
        stroke: 'rgb(78,131,237)',
        fillOpacity: 0.2,
    },
    highlightBackground: {
        fill: ({mortalityColor}) => mortalityColor,
        stroke: ({mortalityColor}) => darken(mortalityColor, 0.5),
        fillOpacity: ({highlightBackgroundOpacity}) => highlightBackgroundOpacity.current,
        strokeOpacity: ({highlightBackgroundOpacity}) => highlightBackgroundOpacity.current,
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
    const mortalityColor = getRateColor(targetNode.data.mortality - 0.3 > 0.5 ? 0.5 : targetNode.data.mortality - 0.3, d.mortalityColor)

    const backgroundOpacity = useRef(0);
    const highlightBackgroundOpacity = useRef(0);

    let animationName = `animation${Math.round(Math.random() * 100)}`;
    let keyframes =
        `@keyframes ${animationName} {
        0% {fill-opacity: ${backgroundOpacity.current}}
        100% {fill-opacity: 0.2}
    }`;

    let highlightAnimationName = `animation${Math.round(Math.random() * 100)}`;
    let highlightKeyframes =
        `@keyframes ${highlightAnimationName} {
        0% {fill-opacity: ${highlightBackgroundOpacity.current}}
        100% {fill-opacity: 1}
    }`;
    let styleSheet = document.styleSheets[0];
    styleSheet.insertRule(keyframes, styleSheet.cssRules.length);

    useEffect(() => {
        // return () => {
        backgroundOpacity.current = 0.2;
        highlightBackgroundOpacity.current = 1
        // }
    })

    const classes = useStyles({mortalityColor, fillColor: branchColorMap[branchRoot], backgroundOpacity, highlightBackgroundOpacity});
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
                          style={//!!data.new ? {transition: 'opacity 3s ease-in'} :
                              {transition: 'd 2s', d: `path("${path}")`, animation: `${animationName} 1s linear 1 1.5s forwards`}}
                    /> : null}
            </g>);
};

export default inject('d')(observer(Link));
