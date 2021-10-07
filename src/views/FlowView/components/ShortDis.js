import {
  makeStyles,
} from '@material-ui/core';
import { mortalityColor } from '../../../constants';
import useRateColor from '../../../utils/hooks/FlowView/useColor';
import React,{useMemo} from 'react';
const useStyles = makeStyles(theme => ({
  root: {
    height: 100,
    position: 'absolute',
    zIndex: 1,
    border: '1px solid #e6e6e6',
    transition: 'opacity 0.3s linear',
    opacity: 1,
    background: '#fff',
    overflow: 'hidden',
    top: 0,
    right: 0
  },
}));


const VNode = React.memo(({ node, scale, vwidth, vheight }) => {
  const { data, x, y, width, height } = node;
  console.log('????');
  const color = useRateColor(data.mortality - 0.3 > 0.5 ? 0.5 : data.mortality - 0.3, mortalityColor);
  return <rect fill={color} x={x * vwidth * scale} y={y * vheight * scale} width={width * vwidth * scale} height={height * vheight * scale}>
  </rect>
})


const Nodes = React.memo(({
  nodesProps, scale, width, height
}) => {
  return <g>
    {!!nodesProps ? nodesProps.map((node) => {
      console.log('node', node);
      return <VNode node={node} scale={scale} vwidth={width} vheight={height} />
    }) : null}
  </g>
})


// 右上角缩略图
const ShortDis = React.forwardRef(({ width, height, initialScale, nodesProps, viewX, viewY, viewW, viewH, scale },ref) => {
  const c = useStyles();
  // 缩略图放大的倍数
  const m_scale = 100 / height * initialScale;
  // 处理数
  const _pNum = (n, defaultV) => {
    return (isNaN(n) || !isFinite(n)) ? defaultV : n;
  }
  return <div style={{ width: _pNum(100 * width / height, 0) }} className={c.root}>
    <svg width="100%" height="100%">
      <Nodes nodesProps={nodesProps} scale={m_scale} width={width} height={height}></Nodes>
      <rect ref={ref} width={width * m_scale / scale} height={height * m_scale / scale} fill="rgba(200, 200, 200, .5)" stroke="black" stroke-width="1" style={{ x: viewX * m_scale, y: viewY * m_scale, transform: `scale(${1})`, strokeWidth: 1 }}></rect>
    </svg>
  </div>
});
export default ShortDis;