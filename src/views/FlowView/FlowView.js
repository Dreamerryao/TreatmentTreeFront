import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {inject, observer} from 'mobx-react';
import {
    Backdrop,
    Checkbox,
    CircularProgress,
    makeStyles,
    Slider,
    Tooltip,
    Typography,
    withStyles
} from '@material-ui/core';
import useSizeWithDefaultSize from "../../utils/hooks/useSize";
import useAutoLayout from "../../utils/hooks/FlowView/useAutoLayout";
import ActionNode from "./ActionNode";
import StateNode from "./StateNode";
import Link from "./Link";
import Panel from "../../components/Panel";
import useDataFilter from "../../utils/hooks/FlowView/useDataFilter";
import {GridPanel, LinkPanel, MortalityRatePanel} from "./FlowViewPanel";
import clsx from "clsx";
import NavSvg from "./NavSvg";

const useStyles = makeStyles(theme => ({
    toolSeparator: {
        height: 32,
        lineHeight: '32px',
        margin: theme.spacing(0, 1),
    },
    text: {
        fontSize: 12,
        height: 32,
        lineHeight: '32px',
        whiteSpace: 'nowrap',
    },
    textItalic: {
        fontStyle: 'italic',
    },
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
}));

const Links = React.memo(function ({
                                       graph,
                                       linksProps,
                                       branchColorMap,
                                       width,
                                       height,
                                       onHoverLink,
                                       onUnhoverLink,
                                       onClickLink,
                                   }) {
    return <g>
        {!!linksProps ? linksProps.map((link, lId) => {
            const props = linksProps[lId];


            return <React.Fragment key={`${link.sourceNode.key}-${link.targetNode.key}`}>
                <Link vw={width} vh={height}
                      onHover={() => !!onHoverLink && onHoverLink(props.branchRoot)}
                      onUnhover={() => !!onUnhoverLink && onUnhoverLink()}
                      onClick={() => !!onClickLink && onClickLink(lId)}
                      branchColorMap={branchColorMap}
                      {...props}/>
            </React.Fragment>
        }) : null}
    </g>
});


const Nodes = React.memo(function ({
                                       graph,
                                       nodesProps,
                                       width,
                                       height,
                                       nodeHeadWidth, nodeBodyWidth, nodeTailWidth,
                                       nodeBodyGlyphHeight, nodeBodyIndexHeight,
                                       onClickNode,
                                       onContextMenu,
                                       onHoverNode,
                                       onUnhoverNode,
                                       onDoubleClick,
                                       toggleExpandedNodes
                                   }) {
    console.log('refresh Nodes');
    return <g>
        {!!nodesProps ? nodesProps.map((node, nId) => {
            const props = node;

            return <React.Fragment key={node.key}>
                {node.key.includes('a')
                    ? <ActionNode vw={width} vh={height}
                      nodeKey={node.key}
                      nId={nId}
                      onClick={() => !!onClickNode && onClickNode(node.key, props.data)}
                      onToggle={toggleExpandedNodes}
                      onHover={() => !!onHoverNode && onHoverNode(node.key, props.data)}
                      onDoubleClick={() => !props.data.real_action && !!onDoubleClick && onDoubleClick(node.key, props.data)}
                      {...props}/>
                    : <StateNode vw={width} vh={height}
                      {...{nodeHeadWidth, nodeBodyWidth, nodeTailWidth, nodeBodyGlyphHeight, nodeBodyIndexHeight}}
                      nodeKey={node.key}
                      nId={nId}
                      onClick={() => !!onClickNode && onClickNode(node.key, props.data)}
                      onToggle={toggleExpandedNodes}
                      onHover={() => !!onHoverNode && onHoverNode(node.key, props.data)}
                      onUnhover={() => !!onUnhoverNode && onUnhoverNode(node.key, props.data)}
                      onDoubleClick={() => !props.data.real_record && !!onDoubleClick && onDoubleClick(node.key, props.data)}
                      onActionDoubleClick={(key, data) => !!onDoubleClick && onDoubleClick(key, data)}
                      {...props}/>}
            </React.Fragment>
        }) : null}
    </g>
})


function FlowView({d}) {
    const ref = useRef(null);
    const [width, height] = useSizeWithDefaultSize(ref);
    console.log(width, height)

    const [nodeHeadWidth, nodeBodyWidth, nodeTailWidth] = [0.02, 0.14, 0.05];
    const [nodeBodyGlyphHeight, nodeBodyIndexHeight] = [0.2, 0.05];
    const [stateNodeHeight, stateNodeWidth, actionNodeWidth] = [nodeBodyGlyphHeight + nodeBodyIndexHeight, nodeHeadWidth + nodeBodyWidth + nodeTailWidth, 0.17];

    const {nodesProps, linksProps} = useAutoLayout(d.graph, {stateNodeHeight, stateNodeWidth, actionNodeWidth}, undefined);

    const [branchColorMap, _] = linksProps.reduce(([colorMap, mapTop], linkProps) => {
        return !!colorMap[linkProps.branchRoot] ? [colorMap, mapTop] : [{...colorMap, [linkProps.branchRoot]: d.branchColor[mapTop]}, mapTop + 1 < d.branchColor.length ? mapTop + 1 : 0]
    }, [{}, 0]);

    const onDoubleClick = useCallback((key, data) => {
        if (key.includes('a')) {
            if (data.open) {
                d.unexpandActionNode(key.slice(0, key.indexOf('a')), key.slice(key.indexOf('a') + 1));
            } else {
                d.expandActionNode(key.slice(0, key.indexOf('a')), key.slice(key.indexOf('a') + 1));
            }
        } else {
            if (data.open) {
                d.hideAction(key);
            } else {
                d.showAction(key);
            }
        }
    }, [d]);

    const onHoverLink = (branchRoot) => {
        d.hoverBranchRoot(branchRoot);
    }
    const onUnhoverLink = () => {d.unhoverBranchRoot();}

    const onHoverNode = (key, data) => {
        d.hoverBranchRoot(data.branch_root);
    }
    const onUnhoverNode = (key, data) => {d.unhoverBranchRoot();}

    const classes = useStyles();
    return <Panel title={'Tree View'} tools={[
        <span className={classes.text}>Dose level of</span>,
        <GridPanel actionColor={d.actionColor[0]} defaultNumber={d.graph.length > 0 ? 3 : 0} />,
        <Typography><span className={clsx(classes.text, classes.textItalic)}>Vasopressor</span></Typography>,
        <GridPanel actionColor={d.actionColor[1]} defaultNumber={d.graph.length > 0 ? 2 : 0} />,
        <Typography><span className={clsx(classes.text, classes.textItalic)}>Intravenous fluid</span></Typography>,
        <Typography className={classes.toolSeparator}> | </Typography>,
        <LinkPanel requireWidth={d.graph.length > 0 ? 50 : 0}/>,
        <Typography><span className={clsx(classes.text)}>Branch of AI policy</span></Typography>,
        <Typography className={classes.toolSeparator}> | </Typography>,
        <Typography>
            <span className={classes.text}>90d's Mortality high</span>
        </Typography>,
        <MortalityRatePanel requireWidth={100}/>,
        <Typography>
            <span className={classes.text}>low</span>
        </Typography>,
    ]} settings={[
    ]}>
        <div ref={ref}
             style={{width: '100%', height: '100%'}}>

            <NavSvg width={width} height={height}>
                <Links graph={d.graph} {...{
                    linksProps,
                    width,
                    height,
                    branchColorMap,
                    onHoverLink,
                    onUnhoverLink,
                }}/>
                <Nodes graph={d.graph} {...{
                    nodesProps,
                    width,
                    height,
                    onDoubleClick,
                    onHoverNode,
                    onUnhoverNode,
                    nodeHeadWidth,
                    nodeBodyWidth,
                    nodeTailWidth,
                    nodeBodyGlyphHeight,
                    nodeBodyIndexHeight
                }}/>
            </NavSvg>

            <Backdrop className={classes.backdrop} open={!d.initGraphReady || !d.recordIndexReady || !d.detailIndexReady}>
                <CircularProgress color="inherit"/>
            </Backdrop>
        </div>
    </Panel>;
}

function mergeProps(defaultProps, assignProps, data) {
    if (!assignProps) return defaultProps;
    if (typeof assignProps === 'object') return {...defaultProps, ...assignProps};
    return {...defaultProps, ...assignProps(data, defaultProps)};
}

export default inject('d')(observer(FlowView));
