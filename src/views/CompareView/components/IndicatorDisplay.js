import React from 'react';
import { inject, observer } from 'mobx-react';
import parseRateColor from '../../../utils/parseRateColor';
import getRateColor from "../../../utils/hooks/FlowView/useColor";
const IndicatorDisplay = ({ d, compareNodes, after, otherNodes }) => {

    const width = 250;
    // 定高
    const height = 20;
    // const height = 10 + compareNodes.length * 10;

    // const colors = ['#c41c00', '#ff5722'];

    console.log(compareNodes, otherNodes)

    const colors = compareNodes.length > 0 && otherNodes.length > 0 ? [
        getRateColor(compareNodes[0].mortality - 0.3 > 0.5 ? 0.5 : compareNodes[0].mortality - 0.3, d.mortalityColor),
        getRateColor(otherNodes[0].mortality - 0.3 > 0.5 ? 0.5 : otherNodes[0].mortality - 0.3, d.mortalityColor)
    ] : ['#c41c00', '#ff5722'];

    const BaseDesign = (x, y, width, height, v) => (<g>
        <circle cx={x-7} cy={y} r={7} fill={'rgb(0,0,0)'}/>
        <text textAnchor={"middle"} x={x-7} y={y} fill={'rgb(255,255,255)'} fontSize={'7px'} dy={'.3em'}>L</text>
        <line x1={x} y1={y} x2={x+width} y2={y} stroke={'rgb(0,0,0)'}/>
        <circle cx={x+width+7} cy={y} r={7} fill={'rgb(0,0,0)'}/>
        <text textAnchor={"middle"} x={x+width+7} y={y} fill={'rgb(255,255,255)'} fontSize={'7px'} dy={'.3em'}>H</text>
        {v.bins.length === 2 ?
            <rect x={x + width * (v.bins[0] - v.range[0]) / (v.range[1] - v.range[0])}
                  y={y-height/2}
                  width={width * (v.bins[1] - v.bins[0]) / (v.range[1] - v.range[0])}
                  height={height}
                  fill={'rgba(0,0,0,0.3)'}
            /> : null
        }
    </g>);

    const [widthTri, heightTri, strokeWidthTri] = [20, 10, 2];
    const TriangleIndex = (x, y, fillColor) => (
        <polygon points={`${x},${y} ${x - widthTri / 2},${y - heightTri} ${x + widthTri / 2},${y - heightTri}`}
                 fill={fillColor} stroke={'black'} strokeWidth={strokeWidthTri}/>);
    // const TriangleIndex = (nodes, v) => {
    //     console.log(nodes)
    //     return nodes.map((data, did) => {
    //         const Triangle = (x, y, fillColor) => (
    //             <polygon points={`${x},${y} ${x - widthTri / 2},${y - heightTri} ${x + widthTri / 2},${y - heightTri}`}
    //                      fill={fillColor} stroke={'black'} strokeWidth={strokeWidthTri}/>);
    //         const value = !!data.record ? data.record[0][v.column_id] : 0;
    //         const itemWidthRange = [v.range[0], v.range[1]];
    //         const ix = width * Math.max(Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1), 0);
    //         return Triangle(ix, height / 2, colors[0]);
    //     });
    // }

    const [headWidthArr, heightArr] = [3, 10];
    const ArrowChange = (x1, y1, x2, y2, fillColor) => {
        const headWidth = x1 < x2 ? headWidthArr : -headWidthArr;
        return Math.abs(x2 - x1) < headWidthArr ?
            <polygon points={`${x1},${y1} ${x2},${y2+heightArr/2} ${x1},${y1+heightArr}`} fill={fillColor}/> :
            <polygon points={`${x1},${y1} ${x2-headWidth},${y2} ${x2},${y2+heightArr/2} ${x2-headWidth},${y2+heightArr} ${x1},${y1+heightArr}`} fill={fillColor}/>;
    };

    return after && compareNodes.length == 0 ? null :
        <div style={{ display: 'flex', flexDirection: 'column', overflowY: 'auto', height: '100%'}}>
            {
                !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].filter((v) => {
                    return d.interestFeatures.indexOf(v.column_name) > -1
                }).map((v) => {
                    return <div style={{ display: 'flex', margin: '5px 0' }}>
                        {!after && <div style={{ width: 120, textAlign: 'end' }}>{v.column_name}</div>}
                        <div style={{ marginLeft: 10, width, height, position: 'relative'}}>
                            <svg width="100%" height="100%" viewBox={`-15 0 ${width+30} ${height}`}>
                                {BaseDesign(0, height / 2, width, height, v)}
                                {
                                    compareNodes.map((data, did) => {
                                        const value = !!data.record ? data.record[0][v.column_id] : 0;
                                        const itemWidthRange = [v.range[0], v.range[1]];
                                        const ix = width * Math.max(Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1), 0);
                                        console.log(value)
                                        // const mortalityColor = parseRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor);
                                        return TriangleIndex(ix, height / 2, colors[0]);
                                        // return <rect fill={colors[did]} x="0" y={5 + 5 * did} height={5} width={width * (Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1))}> </rect>
                                    })
                                }
                                {
                                    otherNodes.map((data, did) => {
                                        const value = !!data.record ? data.record[0][v.column_id] : 0;
                                        const itemWidthRange = [v.range[0], v.range[1]];
                                        const ix = width * Math.max(Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1), 0);
                                        // const mortalityColor = parseRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor);
                                        return TriangleIndex(ix, height / 2, colors[1]);
                                        // return <rect fill={colors[did]} x="0" y={5 + 5 * did} height={5} width={width * (Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1))}> </rect>
                                    })
                                }
                                {
                                    otherNodes.length === compareNodes.length ? compareNodes.map((_, did) => {
                                        const value1 = !!compareNodes[did].record ? compareNodes[did].record[0][v.column_id] : 0;
                                        const ix1 = width * Math.max(Math.min((value1 - v.range[0]) / (v.range[1] - v.range[0]), 1), 0);
                                        const value2 = !!otherNodes[did].record ? otherNodes[did].record[0][v.column_id] : 0;
                                        const ix2 = width * Math.max(Math.min((value2 - v.range[0]) / (v.range[1] - v.range[0]), 1), 0);
                                        return ArrowChange(ix1, height / 2, ix2, height / 2, ix1 > ix2 ? d.colors[2] : d.colors[0]);
                                    }) : null
                                }
                            </svg>
                        </div>
                    </div>
                })
            }
        </div>
}

export default inject('d')(observer(IndicatorDisplay));