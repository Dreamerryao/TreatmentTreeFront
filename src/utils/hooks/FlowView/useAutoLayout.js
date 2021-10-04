import {useMemo} from "react";


function updateEnterDegree(enterDegrees, nodes, links) {
    const nodesNeedToConsider = enterDegrees.map(enterDegree => nodes[enterDegree.nodeIdx].key);
    enterDegrees.forEach(enterDegrees => enterDegrees.enterDegree = 0);
    links
        .filter(link => nodesNeedToConsider.includes(link.source) && nodesNeedToConsider.includes(link.target))
        .forEach(link => enterDegrees[nodesNeedToConsider.indexOf(link.target)].enterDegree++);
}

function findStartNodesIdx(enterDegrees) {
    return enterDegrees
        .filter(enterDegree => enterDegree.enterDegree === 0)
        .map(enterDegree => enterDegree.nodeIdx);
}

function calcCutVal(graphNodes, treeEdges, treeReEdges) {
    const curNodes = graphNodes
        .filter((node, idx) => treeEdges[idx].length + treeReEdges[idx].length === 1)
        .map(node => ({node, edge: treeEdges[node.idx].length > 0 ? treeEdges[node.idx][0] : treeReEdges[node.idx][0]}));
    while (curNodes.length > 0) {
        const {node, edge} = curNodes.shift();
        // console.log({node, edge})
        const localCutValSum = treeReEdges[node.idx].reduce((sum, edge) => {
            return sum + (edge.cutVal === null ? 0 : edge.cutVal);
        }, 0) - treeEdges[node.idx].reduce((sum, edge) => {
            return sum + (edge.cutVal === null ? 0 : edge.cutVal);
        }, 0);
        const localWeightSum = node.nextNodes.reduce((sum, edge) => {
            return sum + edge.w;
        }, 0) - node.prevNodes.reduce((sum, edge) => {
            return sum + edge.w;
        }, 0);
        edge.cutVal = edge.s === node.idx ? localCutValSum + localWeightSum : -localCutValSum - localWeightSum;
        const newNode = graphNodes[edge.s === node.idx ? edge.t : edge.s];
        if (treeEdges[newNode.idx].filter(edge => edge.cutVal === null).length +
            treeReEdges[newNode.idx].filter(edge => edge.cutVal === null).length === 1) {
            // console.log("add new node to tree")
            const edge = treeEdges[newNode.idx].filter(edge => edge.cutVal === null).length > 0 ?
                treeEdges[newNode.idx].filter(edge => edge.cutVal === null)[0] :
                treeReEdges[newNode.idx].filter(edge => edge.cutVal === null)[0];
            curNodes.push({node: newNode, edge});
        }
    }
}

function feasibleTree(nodesProps, layers) {

    const edgeL = (node1, node2) => {
        return Math.exp(node1.y - node2.y) - 1;
    }

    const graphNodes = nodesProps.map(nodeProps => ({
        y: nodeProps.y,
        idx: nodeProps.idxAll,
        nextNodes: nodeProps.sourceLinks.map(sl => ({
            w: !!sl.data.real_action ? 10000 : sl.data.possibility,
            d: 0,
            l: (edge) => edgeL(graphNodes[edge.t], graphNodes[edge.s]),
            s: nodeProps.idxAll,
            t: sl.targetNode.idxAll,
         })),
        prevNodes: []
    }))
    const rawNodeNum = graphNodes.length;
    for (let i = 0; i < rawNodeNum; ++i) {
        const node = graphNodes[i];
        node.nextNodes.forEach(nexNode => {
            const edge1 = {w: nexNode.w, d: nexNode.d, l: (edge) => edgeL(graphNodes[edge.t], graphNodes[edge.s]), s: graphNodes.length, t: node.idx, cutVal: null};
            const edge2 = {w: nexNode.w, d: nexNode.d, l: (edge) => edgeL(graphNodes[edge.t], graphNodes[edge.s]), s: graphNodes.length, t: nexNode.t, cutVal: null};
            const eNode = {
                y: Math.min(node.y, graphNodes[nexNode.t].y),
                idx: graphNodes.length,
                nextNodes: [
                    edge1,
                    edge2,
                ],
                prevNodes: [],
            };
            graphNodes.push(eNode)
            node.prevNodes.push(edge1);
            graphNodes[nexNode.t].prevNodes.push(edge2);
        })
        node.nextNodes = [];
    }
    const treeEdges = graphNodes.map(_ => []), treeReEdges = graphNodes.map(_ => []);
    for (let i = 0; i < layers.length - 1; ++i) {
        // const [eNode, _] = layers[i].nodesIdx.reduce(([eNode, minSlash], nodeIdx) => {
        //     return graphNodes[nodeIdx].prevNodes.reduce(([_eNode, _minSlash], edge) => {
        //         return _minSlash > edge.l(edge) - edge.d ? [graphNodes[edge.s], edge.l(edge) - edge.d] : [_eNode, _minSlash];
        //     }, [eNode, minSlash])
        // }, [{}, Number.MAX_VALUE])
        const [eNode, _] = graphNodes[layers[i + 1].nodesIdx[0]].prevNodes.reduce(([eNode, minIdx], edge) => {
            return minIdx > edge.s ? [graphNodes[edge.s], edge.s] : [eNode, minIdx];
        }, [{}, Number.MAX_VALUE]);
        // const eNode = graphNodes[layers[i + 1].nodesIdx[0]].prevNodes.reduce((eNode, edge) => {
        //     return edge.w === 10000 ? graphNodes[edge.s] : eNode;
        // }, {});
        // console.log(eNode)
        eNode.nextNodes.forEach(edge => {
            treeEdges[eNode.idx].push(edge);
            treeReEdges[edge.t].push(edge);
        })

        // layers[i].nodesIdx.forEach(nodeIdx => {
        //     graphNodes[nodeIdx].prevNodes.forEach(edgeFromUp => {
        //         if (edgeFromUp.s !== eNode.idx) {
        //             const [leftEdge, _] = graphNodes[edgeFromUp.s].nextNodes.reduce(([leftEdge, minY], edge) => {
        //                 return minY > graphNodes[edge.t].y ? [edge, graphNodes[edge.t].y] : [leftEdge, minY];
        //             }, [{}, Number.MAX_VALUE])
        //             treeEdges[edgeFromUp.s].push(leftEdge);
        //             treeReEdges[leftEdge.t].push(leftEdge);
        //         }
        //     })
        // })
    }


    for (let i = rawNodeNum; i < graphNodes.length; ++i) {
        if (treeEdges[i].length > 0) {
            continue;
        }
        const [leftEdge, _] = graphNodes[i].nextNodes.reduce(([leftEdge, minY], edge) => {
            return minY > graphNodes[edge.t].y ? [edge, graphNodes[edge.t].y] : [leftEdge, minY];
        }, [{}, Number.MAX_VALUE])
        treeEdges[i].push(leftEdge);
        treeReEdges[leftEdge.t].push(leftEdge);
    }

    layers.forEach(({_, nodesIdx}) => {
        for (let i = 0; i < nodesIdx.length - 1; ++i) {
            const edge = {
                w: 0,
                d: graphNodes[nodesIdx[i + 1]].y - graphNodes[nodesIdx[i]].y,
                l: (edge) => edgeL(graphNodes[edge.t], graphNodes[edge.s]),
                s: graphNodes[nodesIdx[i]].idx,
                t: graphNodes[nodesIdx[i + 1]].idx,
                cutVal: null,
            };
            graphNodes[nodesIdx[i]].nextNodes.push(edge);
            graphNodes[nodesIdx[i + 1]].prevNodes.push(edge);
            treeEdges[nodesIdx[i]].push(edge);
            treeReEdges[nodesIdx[i + 1]].push(edge);
        }
    })
    calcCutVal(graphNodes, treeEdges, treeReEdges);
    return [graphNodes, treeEdges, treeReEdges];
}

function xCoordinate(nodesProps, layers) {
    const [graphNodes, treeEdges, treeReEdges] = feasibleTree(nodesProps, layers);
    const leaveEdge = () => {
        const e = -1e-4;
        for (let i = 0; i < graphNodes.length; ++i) {
            for (let j = 0; j < treeEdges[i].length; ++j) {
                if (treeEdges[i][j].cutVal !== null && treeEdges[i][j].cutVal < e) {
                    return treeEdges[i][j];
                }
            }
        }
        return null;
    };

    const enterEdge = (edge) => {
        const vis = graphNodes.map(_ => false);
        const dfs = (nodeIdx, metaEdge, fa, dep) => {
            let component = [nodeIdx];
            vis[nodeIdx] = true;
            treeEdges[nodeIdx].forEach(edge => {
                if ((edge.s !== metaEdge.s || edge.t !== metaEdge.t) && !vis[edge.t]) {
                    component = component.concat(dfs(edge.t, metaEdge, nodeIdx, dep + 1));
                }
            })
            treeReEdges[nodeIdx].forEach(edge => {
                if ((edge.s !== metaEdge.s || edge.t !== metaEdge.t) && !vis[edge.s]) {
                    component = component.concat(dfs(edge.s, metaEdge, nodeIdx, dep + 1));
                }
            })
            return component;
        }
        const targetComponent = dfs(edge.s, edge, -1, 0);
        return [targetComponent.reduce(([edge, slash], nodeIdx) => {
            return graphNodes[nodeIdx].prevNodes.reduce(([_edge, _slash], edge) => {
                if (targetComponent.includes(edge.s)) {
                    return [_edge, _slash];
                }
                return _slash > edge.l(edge) - edge.d ? [edge, edge.l(edge) - edge.d] : [_edge, _slash];
            }, [edge, slash]);
        }, [{}, Number.MAX_VALUE])[0], targetComponent]
    }

    let e;
    while ((e = leaveEdge()) !== null) {
        const [f, component] = enterEdge(e);
        // const delta = f.l(f) - f.d;
        const delta = graphNodes[f.t].y - graphNodes[f.s].y - f.d;
        component.forEach(idx => {
            graphNodes[idx].y -= delta;
        })
        treeEdges.forEach(edges => edges.forEach(edge => edge.cutVal = null));
        treeEdges[e.s].splice(treeEdges[e.s].indexOf(e), 1);
        treeReEdges[e.t].splice(treeReEdges[e.t].indexOf(e), 1);
        treeEdges[f.s].push(f);
        treeReEdges[f.t].push(f);
        calcCutVal(graphNodes, treeEdges, treeReEdges);
    }
    const normalDelta = nodesProps[layers[0].nodesIdx[0]].y - graphNodes[layers[0].nodesIdx[0]].y;
    nodesProps.forEach((nodeProps, idx) => {
        nodeProps.y = graphNodes[idx].y + normalDelta;
    })
}

export default function useAutoLayout(graph, {stateNodeHeight, stateNodeWidth, actionNodeWidth}, optimalLayer) {
    //region init
    const {nodesProps, linksProps} = useMemo(() => {
        const nodesProps = graph.map((node, index) => [{
            data: node,
            layer: node.layer_id,
            idx: -1,
            key: node.node_id.toString(),
            idxAll: -1,
            x: -1,
            y: -1,
            width: stateNodeWidth,
            height: stateNodeHeight,
            sourceLinks: [],
            targetLinks: [],
        }
        // , node.actions.map((action, idx) => ({
        //     data: action,
        //     layer: node.layer_id * 2 + 1,
        //     idx: -1,
        //     key: node.node_id.toString() + 'a' + idx,
        //     idxAll: -1,
        //     x: -1,
        //     y: -1,
        //     width: actionNodeWidth,
        //     height: !!action.real_action ? stateNodeHeight : stateNodeHeight * action.possibility / node.actions.reduce((sum, action) => sum + action.possibility, 0),
        //     sourceLinks: [],
        //     targetLinks: [],
        // }))
        ]).flat().flat();
        const linksProps = graph.map((node, index) => node.actions.map((action, idx) => [
        //     {
        //     data: action,
        //     branchRoot: node.branch_root,
        //     sourcePoint1: [-1, -1],
        //     sourcePoint2: [-1, -1],
        //     targetPoint1: [-1, -1],
        //     targetPoint2: [-1, -1],
        //     isReal: false,
        //     width: -1,
        //     sourceNodeIdx: nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString()),
        //     targetNodeIdx: nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString() + 'a' + idx),
        //     sourceNode: nodesProps[nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString())],
        //     targetNode: nodesProps[nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString() + 'a' + idx)],
        // },
            action.next_nodes.map(nextNode => ({
                data: action,
                branchRoot: node.branch_root,
                sourcePoint1: [-1, -1],
                sourcePoint2: [-1, -1],
                targetPoint1: [-1, -1],
                targetPoint2: [-1, -1],
                isReal: false,
                // width: -1,
                width: !!action.real_action ? stateNodeHeight : stateNodeHeight * action.possibility / node.actions.reduce((sum, action) => sum + action.possibility, 0),
                sourceNodeIdx: nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString()),
                targetNodeIdx: nodesProps.findIndex(nodeProps => nodeProps.key === nextNode.toString()),
                sourceNode: nodesProps[nodesProps.findIndex(nodeProps => nodeProps.key === node.node_id.toString())],
                targetNode: nodesProps[nodesProps.findIndex(nodeProps => nodeProps.key === nextNode.toString())],
            }))
        ])).flat().flat().flat();

        nodesProps.forEach((nodeProps, index) => {
            nodeProps.idxAll = index
        })

        linksProps.forEach(linkProps => {
            linkProps.sourceNode.sourceLinks.push(linkProps);
            linkProps.targetNode.targetLinks.push(linkProps);
            linkProps.isReal = !!linkProps.targetNode.data.real_record && !!linkProps.sourceNode.data.real_record;
        })

        return {nodesProps, linksProps};
    }, [actionNodeWidth, graph, stateNodeHeight, stateNodeWidth])
    //endregion

    //region layer
    const {layerCount, layers, maxLayerValue} = useMemo(() => {
        let maxLayerValue = 0, layers = [];
        let layer = 0;
        for (layer = 0; ; ++layer) {
            const nodesIdxInThisLayer = [];
            for (let i = 0; i < nodesProps.length; ++i) {
                if (nodesProps[i].layer === layer) {
                    nodesIdxInThisLayer.push(i);
                }
            }
            if (nodesIdxInThisLayer.length === 0) {
                break;
            }
            if (!!optimalLayer) {
                nodesIdxInThisLayer.sort((nodeIdx1, nodeIdx2) => {
                    for (let i = 0; i < optimalLayer.length; ++i) {
                        const idx1InLayer = optimalLayer[i].findIndex(v => nodesProps[nodeIdx1].key === v.toString());
                        const idx2InLayer = optimalLayer[i].findIndex(v => nodesProps[nodeIdx2].key === v.toString());
                        // console.log(idx1InLayer, idx2InLayer)
                        if (idx1InLayer === -1 || idx2InLayer === -1) {
                            continue;
                        }
                        return idx1InLayer - idx2InLayer;
                    }
                    return -1;
                });
            }


            nodesIdxInThisLayer.forEach((nodeIdx, idx) => {
                nodesProps[nodeIdx].idx = idx;
            })

            nodesIdxInThisLayer.sort((nodeIdx1, nodeIdx2) => {
                const node1 = nodesProps[nodeIdx1], node2 = nodesProps[nodeIdx2];
                const v1 = !!node1.data.real_record || !!node1.data.real_action ? 1 : 0, v2 = !!node2.data.real_record || !!node2.data.real_action ? 1 : 0;
                return v1 === 0 && v2 === 0 ? node1.idxAll - node2.idxAll : v2 - v1;
            });


            let layerHeight = 0;
            nodesIdxInThisLayer.forEach((nodeIdx, idx) => {
                nodesProps[nodeIdx].idx = idx;
                layerHeight += nodesProps[nodeIdx].height;
            })
            layers.push({
                sumHeight: layerHeight,
                nodesIdx: nodesIdxInThisLayer,
            });
        }
        return {
            layerCount: layer,
            layers,
            maxLayerValue,
        }
    }, [nodesProps, optimalLayer]);
    //endregion

    //region node filter

    //endregion

    //region layout config
    const {paddingWidth, padding} = useMemo(() => {
        if (layerCount === 0) return {
            paddingWidth: 0, padding: 0
        };

        const paddingWidth = 2 / (layerCount * 0.2 + layerCount - 1)// * layerCount / 2;

        // const valueHeight = 0.9 / maxLayerValue,
        const padding = 0.02;
        // layers.reduce(
        //         (currentPadding, {sumValue, nodesIdx}) => (
        //             Math.min(currentPadding, (1 - sumValue * valueHeight) / (nodesIdx.length - 1))
        //         ),
        //         1
        //     ) + 0.005;

        return {paddingWidth, padding}
    }, [layerCount]);
    //endregion

    //region node layout
    useMemo(() => {
        if (layerCount === 0) return;

        layers.forEach(({sumHeight, nodesIdx}, lId) => {
            const x = (stateNodeWidth + paddingWidth) * lId;
            const fullHeight = sumHeight + (nodesIdx.length - 1) * padding;
            const [startY, _] = nodesProps[nodesIdx[0]].targetLinks.length === 0 ? [0.5 - fullHeight, 0] :
                nodesProps[nodesIdx[0]].targetLinks.reduce(([y, minIdx], tl) => {
                    return minIdx > tl.sourceNode.idxAll ? [tl.sourceNode.y, tl.sourceNode.idxAll] : [y, minIdx];
                }, [0.5 - fullHeight, Number.MAX_VALUE]);
            nodesIdx.reduce((y, nodeIdx) => {
                nodesProps[nodeIdx].x = x;
                nodesProps[nodeIdx].y = y;
                return y + nodesProps[nodeIdx].height + padding;
            }, startY);
        })
        xCoordinate(nodesProps, layers);
    }, [layerCount, layers, nodesProps, stateNodeWidth, paddingWidth, padding]);
    //endregion

    //region link layout
    useMemo(() => {
        if (layerCount === 0) return;

        nodesProps.forEach(nodeProps => {
            //target
            nodeProps.targetLinks.reduce((y, linkProps) => {
                // linkProps.width = nodeProps.height;
                linkProps.targetPoint1 = [nodeProps.x, y];
                linkProps.targetPoint2 = [nodeProps.x, y + nodeProps.height]; // TODO: only one target node


                return y + linkProps.width;
            }, nodeProps.y)
        });
        nodesProps.forEach(nodeProps => {
            nodeProps.sourceLinks.sort((linkProps1, linkProps2) => {
                const y1 = linkProps1.targetPoint1[1];
                const y2 = linkProps2.targetPoint1[1];
                return y1 - y2;
            });
            //source

            nodeProps.data.actions.reduce((y, action) => {
                const actionPadding = stateNodeHeight / 16;
                const actionHeight = (stateNodeHeight - actionPadding * 3) / 4;
                action.next_nodes.forEach(nextNode => {
                    const sourceLink = nodeProps.sourceLinks[nodeProps.sourceLinks.findIndex(linkProps => linkProps.targetNode.key === nextNode.toString())]
                    sourceLink.sourcePoint1 = [nodeProps.x + nodeProps.width, y];
                    sourceLink.sourcePoint2 = [nodeProps.x + nodeProps.width, y + actionHeight];

                })

                // if (!!action.real_action) {
                //     return y;
                // }

                return y + actionHeight + actionPadding;
            }, nodeProps.y);

            // const maxY =
            //     nodeProps.sourceLinks.reduce((y, linkProps) => {
            //         // linkProps.width = linkProps.data.frequency * valueHeight;
            //         linkProps.sourcePoint1 = [nodeProps.x + nodeProps.width, y];
            //         // if (nodeProps.key.includes('a')) {
            //         //     linkProps.sourcePoint2 = [nodeProps.x + nodeProps.width, y + nodeProps.height];
            //         // } else {
            //         linkProps.sourcePoint2 = [nodeProps.x + nodeProps.width, y + linkProps.width];
            //         // }
            //
            //         if (!!linkProps.targetNode.data.real_action) {
            //             return y;
            //         }
            //
            //         return y + linkProps.width;
            //     }, nodeProps.y)
            // const offsetY = (nodeProps.height - maxY + nodeProps.y) / 2;
            //
            // nodeProps.sourceLinks.forEach((linkProps) => {
            //     linkProps.sourcePoint1[1] += offsetY;
            //     linkProps.sourcePoint2[1] += offsetY;
            // })
        });
        // nodesProps.forEach(nodeProps => {
        //     nodeProps.targetLinks.sort((linkProps1, linkProps2) => {
        //         const y1 = linkProps1.sourcePoint1[1];
        //         const y2 = linkProps2.sourcePoint1[1];
        //         return y1 - y2;
        //     });
        //     //target
        //     nodeProps.targetLinks.reduce((y, linkProps) => {
        //         linkProps.width = linkProps.data.frequency * valueHeight;
        //         linkProps.targetPoint = [nodeProps.x, y + linkProps.width / 2];
        //
        //         return y + linkProps.width;
        //     }, nodeProps.y)
        // });
    }, [layerCount, nodesProps]);
    //endregion

    return {
        nodesProps,
        linksProps,
    }
}
