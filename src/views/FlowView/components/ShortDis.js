import {
  makeStyles,
} from '@material-ui/core';
const useStyles = makeStyles(theme => ({
  root: {
    height: 100,
    position: 'absolute',
    zIndex: 1,
    border: '1px solid #e6e6e6',
    transition: 'opacity 0.3s linear',
    opacity: 0.3,
    background: '#fff',
    overflow: 'hidden',
    top: 0,
    right: 0
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

// 右上角缩略图
const ShortDis = ({width,height,initialScale}) => {
  const c = useStyles();
  return <div style={{width:100*width/height}} className={c.root}></div>
}
export default ShortDis;