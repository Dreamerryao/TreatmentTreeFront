import {useMemo} from "react"

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

function removeFlow(node, nodes, links, removeList, sequences) {
    links.filter(link => link.sequences_idx.some(seq => removeList.includes(seq)))
        .forEach(link => {
            if (link.sequences_idx.every(seq => removeList.includes(seq))) {
                link.delete = true;
            } else {
                link.sequences_idx = link.sequences_idx.filter(seq => !removeList.includes(seq));
                link.frequency = link.sequences_idx.length
            }
        })
    while (true) {
        const foundIndex = links.findIndex(link => !!link.delete);
        if (foundIndex === -1) {
            break;
        }
        links.splice(foundIndex, 1);
    }
    nodes.filter(node => node.sequences_idx.some(seq => removeList.includes(seq)))
        .forEach(node => {
            if (node.sequences_idx.every(seq => removeList.includes(seq))) {
                node.delete = true;
            } else {
                node.sequences_idx = node.sequences_idx.filter(seq => !removeList.includes(seq));
                node.frequency = node.sequences_idx.length;
                node.winning = node.sequences_idx.map(seqId => sequences[seqId].winner).reduce((sum, a) => {
                    return sum + a;
                }, 0);
            }
        })
    while (true) {
        const foundIndex = nodes.findIndex(node => !!node.delete);
        if (foundIndex === -1) {
            break;
        }
        nodes.splice(foundIndex, 1);
    }
}

export default function useDataFilter(rawNodes, rawLinks, similarityBar, frequencyBar, sequences, rawTactics) {
    //region layer
    const {layerCount, layers} = useMemo(() => {
        const enterDegrees = rawNodes.map((_, i) => ({
            nodeIdx: i,
            enterDegree: 0,
        }));
        let layer = 0, layers = [];
        while (enterDegrees.length > 0) {
            updateEnterDegree(enterDegrees, rawNodes, rawLinks);
            const nodesIdxInThisLayer = findStartNodesIdx(enterDegrees);
            nodesIdxInThisLayer.sort((idx1, idx2) => {
                return rawNodes[idx2].frequency - rawNodes[idx1].frequency;
            });

            if (nodesIdxInThisLayer.length === 0) {
                console.error("There is a loop in data! Check the data please!");
                return {
                    layerCount: 0,
                    maxLayerValue: 0,
                    layers: [],
                }
            }
            layers.push({
                nodesIdx: nodesIdxInThisLayer,
            });
            layer++;

            for (let idx = enterDegrees.length; idx--;) {
                if (!nodesIdxInThisLayer.includes(enterDegrees[idx].nodeIdx)) continue;
                enterDegrees.splice(idx, 1);
            }
        }
        return {
            layerCount: layer,
            layers,
        }
    }, [rawLinks, rawNodes]);
    //endregion

    //region merge nodes
    const {mergedNodes, mergedLinks} = useMemo(() => {
        const nodes = [], links = [];

        return {
            mergedNodes: rawNodes,
            mergedLinks: rawLinks,
        }
    }, [rawLinks, rawNodes]);
    //endregion

    //region filter nodes
    const {nodes, links} = useMemo(() => {
        const nodes = rawNodes.map(node => JSON.parse(JSON.stringify(node))),
            links = rawLinks.map(link => JSON.parse(JSON.stringify(link)));

        // console.log(layers)
        layers.forEach(layer => layer.nodesIdx.forEach(nodeIdx => {
            const node = rawNodes[nodeIdx];
            if (!!node.dummy) {
                return
            }
            // const tactic = rawTactics[node.tactic];
            // if (tactic.sequences_idx.length < frequencyBar) {
            //     removeFlow(node, nodes, links, node.sequences_idx, sequences);
            // }
            if (node.frequency < frequencyBar) {
                removeFlow(node, nodes, links, node.sequences_idx, sequences);
            }
        }))
        return {
            nodes,
            links,
        }
    }, [frequencyBar, layers, rawLinks, rawNodes, sequences])
    //endregion
    // console.log(nodes);
    return {
        nodes,
        links,
    }
};
