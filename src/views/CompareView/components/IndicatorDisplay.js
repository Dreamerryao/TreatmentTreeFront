import React from 'react';
import { inject, observer } from 'mobx-react';
import parseRateColor from '../../../utils/parseRateColor';
import getRateColor from "../../../utils/hooks/FlowView/useColor";
const IndicatorDisplay = ({ d, compareNodes, after, otherNodes }) => {

    const width = 200;
    // 定高
    const height = 25;
    // const height = 10 + compareNodes.length * 10;

    // const colors = ['#c41c00', '#ff5722'];

    console.log(compareNodes, otherNodes)

    const colors = compareNodes.length > 0 && otherNodes.length > 0 ? [
        getRateColor(compareNodes[0].mortality - 0.3 > 0.5 ? 0.5 : compareNodes[0].mortality - 0.3, d.mortalityColor),
        getRateColor(otherNodes[0].mortality - 0.3 > 0.5 ? 0.5 : otherNodes[0].mortality - 0.3, d.mortalityColor)
    ] : ['#c41c00', '#ff5722'];
    return after && compareNodes.length == 0 ? null : <div style={{ position: 'relative' }}>
        {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v) => {
          return !after ? <div style={{ width: 100, textAlign: 'end', lineHeight: '20px' }}>{v.column_name}:</div> : null
        })
      }
    </div> */}
        <svg width={after ? 210 : 325} height={25 * (d.detailIndex[d.dataset]?.length ?? 1) - 5} viewBox={after ? `-5 0 210 ${25 * (d.detailIndex[d.dataset]?.length ?? 1) - 5}` : ''}>
            {
                !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v, vid) => {
                    const itemWidthRange = [v.range[0], v.range[1]];
                    return <g key={vid}>
                        {!after && <text textAnchor="end" x="110" y={5 * vid + 20 * (vid + 1) - 5}>{v.column_name}</text>}
                        <rect x={(after ? 0 : 120) - 5} y={25 * vid} width={width+10} height={height} fill="rgb(133,133,133)"></rect>
                        <rect x={(after ? 0 : 120) + width * (v.bins[0] - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0])} y={25 * vid} width={width * (v.bins[1] - v.bins[0]) / (itemWidthRange[1] - itemWidthRange[0])} height={height} fill="rgba(33,33,33,0.3)"></rect>
                        {
                            compareNodes.map((data, did) => {
                                const value = !!data.record ? data.record[0][v.column_id] : 0;
                                // const mortalityColor = parseRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor);
                                return <rect fill={colors[0]} x={after ? 0 : 120} y={25 * vid + 7.5} height={5} width={width * Math.max(Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1), 0)}> </rect>
                            })
                        }
                    </g>
                })
            }
            {
                !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v, vid) => {

                    return vid === 0 ? null : otherNodes.length && otherNodes.map((data, did) => {
                        const beforeV = d.detailIndex[d.dataset][vid - 1];
                        const beforeValue = !!data.record ? data.record[0][beforeV.column_id] : 0;
                        const beforeItemWidthRange = [beforeV.range[0], beforeV.range[1]];
                        const value = !!data.record ? data.record[0][v.column_id] : 0;
                        const itemWidthRange = [v.range[0], v.range[1]];
                        return <line key={did} strokeDasharray="5,5" stroke={colors[1]} stroke-width="2" x1={(after ? 0 : 120) + width * (Math.min((beforeValue - beforeItemWidthRange[0]) / (beforeItemWidthRange[1] - beforeItemWidthRange[0]), 1))} y1={25 * (vid - 1) + 5 + 5 * did + 2.5}
                                     x2={(after ? 0 : 120) + width * (Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1))} y2={25 * vid + 5 + 5 * did + 2.5}></line>
                    })
                })
            }
        </svg>
        {/* <div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v) => {
          return <div style={{ display: 'flex', margin: '5px 0' }}>
            {!after && <div style={{ width: 100, textAlign: 'end' }}>{v.column_name}:</div>}
            <div style={{ marginLeft: 10, width, height, position: 'relative' }}>
              <svg width="100%" height="100%" >
                <rect x="0" y="0" width={width} height={height} fill="rgb(233,233,233)" ></rect>
                <rect x={width * 0.25} y="0" width={width * 0.5} height={height} fill="rgba(86,165,92,0.3)"></rect>
                {
                  compareNodes.map((data, did) => {
                    const value = !!data.record ? data.record[0][v.column_id] : 0;
                    const itemWidthRange = [v.bins[0] * 2 - v.bins[1], v.bins[1] * 2 - v.bins[0]];
                    // const mortalityColor = parseRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor);
                    return <rect fill={colors[did]} x="0" y={5 + 5 * did} height={5} width={width * (Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1))}> </rect>
                  })
                }
              </svg>
              <div style={{ position: 'absolute', bottom: -10, width: '100%', height: 10 }}>
              </div>
            </div>
          </div>
        })
      }
    </div> */}
    </div >
}

export default inject('d')(observer(IndicatorDisplay));