import React, { useCallback, useState } from "react";
import clsx from "clsx";
import { inject, observer } from "mobx-react";
import useRateColor from "../../utils/hooks/FlowView/useColor";
import { createStyles, makeStyles } from "@material-ui/core";
import { GridNode, RangeNode, ActionNode } from './GridNode';

const useStyles = makeStyles((theme) => createStyles({
    outerNode: {
        fill: 'rgb(255, 255, 255)',
        // fillOpacity: 0.8,
        width: ({ width }) => width,
        height: ({ height }) => height,
    },
    headNode: {
        fill: ({ mortalityColor }) => !!mortalityColor ? mortalityColor : 'rgb(133, 133, 133)',
        width: ({ nodeHeadWidth }) => nodeHeadWidth,
        height: ({ height }) => height,
    },
    tailNode: {
        fill: 'rgb(255, 255, 255)',
        width: ({ nodeTailWidth }) => nodeTailWidth,
        height: ({ height }) => height,
    },
    text: {
        fill: 'rgb(255, 255, 255)',
    },
    stroke: {
        stroke: 'rgb(0, 0, 0)',
        strokeWidth: ({ width, height }) => Math.min(width, height) / 50,
    },
    innerNode: {
        fill: 'rgb(255,255,255)',
        opacity: 0.8,
        width: ({ nodeBodyWidth, innerBoxX }) => nodeBodyWidth - innerBoxX * 2,
        height: ({ height, innerBoxY }) => height - innerBoxY * 2,
        x: ({ innerBoxX }) => innerBoxX,
        y: ({ innerBoxY }) => innerBoxY,
    }
}));

const StateNode = ({ d,
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
    nodeHeadWidth, nodeBodyWidth, nodeTailWidth, nodeBodyGlyphHeight, nodeBodyIndexHeight,
    onToggle,
    sourceLinks,
    targetLinks,
    onClick,
    onDoubleClick,
    onActionDoubleClick,
    onHover,
    onUnhover }) => {

    const [hoverHighlight, setHoverHighlight] = useState(false)

    const mortalityColor = useRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor)

    const innerBoxX = nodeBodyWidth / 16, innerBoxY = nodeBodyGlyphHeight / 16;
    const gridWidth = !!d.detailIndex[d.dataset] ? ((nodeBodyWidth - 2 * innerBoxX) / d.detailIndex[d.dataset].length) : 0, gridHeight = (nodeBodyGlyphHeight + nodeBodyIndexHeight) - 2 * innerBoxY;

    const actionWidthTotal = nodeTailWidth - nodeTailWidth / 25;
    const actionHeightTotal = height - height / 25;
    const actionPadding = actionHeightTotal / 16;
    const actionHeight = (actionHeightTotal - actionPadding * 3) / 4;
    const [actionYReduce, _] = data.actions.reduce(([ys, y], action) => [ys.concat([y]), y + actionHeight + actionPadding], [[], 0])

    const classes = useStyles({
        mortalityColor,
        highlight: d.highlight,
        width: width * vw,
        height: height * vh,
        nodeHeadWidth: nodeHeadWidth * vw,
        nodeBodyWidth: nodeBodyWidth * vw,
        nodeTailWidth: nodeTailWidth * vw,
        innerBoxX: innerBoxX * vw,
        innerBoxY: innerBoxY * vh,
    });

    const colorMap = ['','url(#shadow)','url(#lightShadow)'];
return <g
    onMouseEnter={() => {
        !!onHover && onHover();
        setHoverHighlight(true)
    }}
    onMouseLeave={() => {
        !!onUnhover && onUnhover();
        setHoverHighlight(false)
    }}
    onClick={() => {
        d.chosenItems.findIndex(n => n.node_id == nodeKey) == 0 - 1 ?
            d.setChosenItem(d.graph.filter(node => node.node_id == nodeKey)[0]) :
            d.removeChosenItem(nodeKey)
    }}
    // onDoubleClick={() => {
    //     !!onDoubleClick && onDoubleClick();
    // }}
    filter={hoverHighlight ? 'url(#lightShadow)' : colorMap[d.chosenItems.findIndex(n => n.node_id == nodeKey)+1]}
    >
    <g transform={`translate(${vw * x}, ${vh * y})`} style={//!!data.new ? {transition: 'opacity 3s ease-in'} :
        { transition: '2s' }}>
        <rect className={clsx(classes.outerNode, classes.stroke)} />
        {/*<rect className={clsx(classes.innerNode)} />*/}
        <rect className={clsx(classes.headNode, classes.stroke)} />
        <g transform={`translate(${vw * (nodeHeadWidth + innerBoxX)}, ${vh * innerBoxY})`}>
            {!!data.record && !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v, index) => {
                // if (v.type === 'bin') {
                //     return (<g transform={`translate(${vw * index * gridWidth}, 0)`} key={index}>
                //         <GridNode vw={vw} vh={vh} width={gridWidth} height={gridHeight} valueIndex={v}
                //                   value={data.record[0][v.column_id]}/>
                //     </g>)
                // } else {
                return (<g transform={`translate(${vw * index * gridWidth}, 0)`} key={index}>
                    <RangeNode vw={vw} vh={vh} width={gridWidth} height={gridHeight} valueIndex={v}
                        value={data.record[0][v.column_id]} />
                </g>)
                // }
            })}
        </g>

        <rect x={vw * (nodeHeadWidth + nodeBodyWidth)} y={0} className={clsx(classes.tailNode, classes.stroke)} />
        <g transform={`translate(${vw * (nodeHeadWidth + nodeBodyWidth)}, ${0})`}>
            {!!data.actions && data.actions.map((action, index) => {

                return <g transform={`translate(${(nodeTailWidth - actionWidthTotal) * vw / 2}, ${((height - actionHeightTotal) / 2 + actionYReduce[index]) * vh})`} key={index}>
                    <ActionNode
                        vw={vw}
                        vh={vh}
                        width={actionWidthTotal}
                        height={actionHeight}
                        data={action}
                        onDoubleClick={() => !!onActionDoubleClick && onActionDoubleClick(nodeKey + 'a' + index, action)}
                    />
                </g>
            })}
        </g>

    </g>
    </g >
}

export default inject('d')(observer(StateNode));
