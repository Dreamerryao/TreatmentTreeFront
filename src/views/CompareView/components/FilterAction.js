import ActionNode from "../../FlowView/ActionNode";
import { inject, observer } from 'mobx-react';

const FilterAction = ({ actions,onClick,curIndex }) => {
  return <div style={{ display: 'flex', flexDirection: 'column' }}>
    {
      !!actions && actions.map((action,id) => {
        return <svg width={62} height={22} onClick={()=>onClick(id)} style={{ margin: 10,boxShadow:id==curIndex?'rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px':''}}><ActionNode
          vw={1}
          vh={1}
          width={60}
          height={20}
          x={1}
          y={1}
          data={action}
        ></ActionNode></svg>
      })
    }
  </div>
};

export default inject('d')(observer(FilterAction));