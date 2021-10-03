import React, {useCallback, useState} from "react";
import clsx from "clsx";
import {inject, observer} from "mobx-react";
import {createStyles, makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => createStyles({
    text: {
        fill: 'rgb(255, 255, 255)',
    },
    grid: {
        stroke: 'rgb(0, 0, 0)',
        fill: 'rgb(255, 255, 255)',
        strokeWidth: ({gridWidth}) => gridWidth / 25,
    },
    action1Grid: {
        fill: ({actionColor}) => actionColor[0],
    },
    action2Grid: {
        fill: ({actionColor}) => actionColor[1],
    },
    blankGrid: {
        fill: 'rgb(255, 255, 255)',
    },
    innerGrid: {
        width: ({gridWidth}) => gridWidth - gridWidth / 4,
        height: ({gridHeight}) => gridHeight - gridHeight / 4,
        x: ({gridWidth}) => gridWidth / 8,
        y: ({gridHeight}) => gridHeight / 8,
        // transform: ({gridWidth, gridHeight}) => `translate(${gridWidth / 20}, ${gridHeight / 20})`,
    },
    outerGrid: {
        fill: 'rgb(255, 255, 255)',
        width: ({gridWidth}) => gridWidth,
        height: ({gridHeight}) => gridHeight,
    },
    stroke: {
        fill: 'none',
    }
}));

const ActionNode = ({d,
              nodeKey,
              vw,
              vh,
              data,
              layer,
              idx,
              nId,
              x,
              y,
              width,
              height,
              onToggle,
              sourceLinks,
              targetLinks,
              onClick,
              onDoubleClick,
              onHover,}) => {


    const [hoverHighlight, setHoverHighlight] = useState(false);

    const gridWidth = width / 5 * vw;
    const gridHeight = height / 2 * vh;

    const classes = useStyles({
        actionColor: d.actionColor,
        gridWidth,
        gridHeight
    });

    const action = data.action + 1;
    const action1 = Math.floor((action - 0.0001) / 5) + 1
    const action2 = action - Math.floor(action / 5) * 5


    return <g
            onMouseEnter={() => {
                !!onHover && onHover();
                setHoverHighlight(true)
            }}
            onMouseLeave={() => {
                !!onHover && onHover();
                setHoverHighlight(false)
            }}
            onDoubleClick={() => {
                !!onDoubleClick && onDoubleClick();
            }}
            filter={hoverHighlight ? 'url(#lightShadow)' : ''}
    >
        <g transform={`translate(${vw * x}, ${vh * y})`} style={//!!data.new ? {transition: 'opacity 3s ease-in'} :
             {transition: '2s'}}>
            <rect width={width * vw} height={height * vh / 2} className={classes.grid}/>
            <rect transform={`translate(${0}, ${height * vh / 2})`} width={width * vw} height={height * vh / 2} className={classes.grid}/>
            {[0,1,2,3,4].map(idx => (
                <g transform={`translate(${gridWidth * idx}, ${0})`} key={idx}>
                    <rect key={`${idx},${0}`} width={gridWidth} height={gridHeight}
                          className={clsx(classes.outerGrid)}
                    />
                    <rect key={`inner${idx},${0}`} className={clsx(classes.innerGrid, {
                        [classes.blankGrid]: idx >= action1,
                        [classes.action1Grid]: idx < action1,
                    })}/>
                </g>
            ))}
            {[0,1,2,3,4].map(idx => (
                <g transform={`translate(${gridWidth * idx}, ${gridHeight})`} key={idx}>
                    <rect key={`${idx},${1}`} width={gridWidth} height={gridHeight}
                          className={clsx(classes.outerGrid)}
                    />
                    <rect key={`inner${idx},${1}`} className={clsx(classes.innerGrid, {
                        [classes.blankGrid]: idx >= action2,
                        [classes.action2Grid]: idx < action2,
                    })}/>
                </g>
            ))}
        </g>
    </g>
}

export default inject('d')(observer(ActionNode));
