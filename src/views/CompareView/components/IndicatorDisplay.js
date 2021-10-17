import React from 'react';
import { inject, observer } from 'mobx-react';
import parseRateColor from '../../../utils/parseRateColor';
const IndicatorDisplay = ({ d, compareNodes, after }) => {

  const width = 200;
  const height = 15 + compareNodes.length * 15;

  return after && compareNodes.length == 0 ? null : <div style={{ position: 'relative', height: '100%', overflow: 'auto' }}>
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {
        !!d.detailIndex[d.dataset] && d.detailIndex[d.dataset].map((v) => {
          return <div style={{ display: 'flex', margin: '10px 0' }}>
            <div style={{ width: 100, textAlign: 'end' }}>{v.column_name}:</div>
            <div style={{ marginLeft: 20, width, height, position: 'relative' }}>
              <svg width="100%" height="100%" >
                <rect x="0" y="0" width={width} height={height} fill="rgba(133,133,133,0.1)" ></rect>
                <rect x={width * 0.25} y="0" width={width * 0.5} height={height} fill="rgba(233,255,233,0.5"></rect>
                {
                  compareNodes.map((data, did) => {
                    const value = !!data.record ? data.record[0][v.column_id] : 0;
                    const itemWidthRange = [v.bins[0] * 2 - v.bins[1], v.bins[1] * 2 - v.bins[0]];
                    const mortalityColor = parseRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, d.mortalityColor);
                    return <rect fill={mortalityColor} x="0" y={5 + 20 * did} height={15} width={width * (Math.min((value - itemWidthRange[0]) / (itemWidthRange[1] - itemWidthRange[0]), 1))}> </rect>
                  })
                }
              </svg>
              <div style={{ position: 'absolute', bottom: -10, width: '100%', height: 10 }}>
                {/* x轴刻度 */}
              </div>
            </div>
          </div>
        })
      }
    </div>
  </div>
}

export default inject('d')(observer(IndicatorDisplay));