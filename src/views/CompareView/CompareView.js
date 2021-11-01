import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { makeStyles } from '@material-ui/core';
import Panel from "../../components/Panel";
import IndicatorDisplay from './components/IndicatorDisplay';
import FilterAction from './components/FilterAction';


const useStyles = makeStyles(theme => ({
    container: {
        width: '100%',
        height: '100%',
        // overflow: 'auto',
        padding: 20,
        display: 'flex',
        alignItems: 'center',
        position: 'relative'
    },

}));


export default inject('d')(observer(function CompareView({ d }) {
    const classes = useStyles();
    const compareNodes = d.chosenItems;
    const [actions, setActions] = React.useState([]);
    React.useEffect(() => {
        setActions(compareNodes.reduce((pre, cur) => {
            pre.push(cur.actions.map(x => x.action));
            return pre;
        }, []));
    }, [compareNodes])

    const [filterAction, setFilterAction] = React.useState([]);
    React.useEffect(() => {
        let f = !!actions ? actions[0] : [];
        actions.forEach((a) => {
            f = f.filter(x => a.includes(x))
        })
        setFilterAction(f);
    }, [actions])

    const [curIndex, setCurIndex] = React.useState(0);
    // const [compareAfterNodes, setAfterNodes] = React.useState([]);
    React.useEffect(() => {
        const action = !!filterAction ? filterAction[curIndex] : -1;
        console.log('action', action)
        d.setChosenAfterItem(compareNodes, action);
    }, [compareNodes, curIndex, filterAction])
    const compareAfterNodes = d.chosenAfterItems;
    return <Panel title="Detail View">
        <div className={classes.container}>
            <IndicatorDisplay compareNodes={compareNodes} otherNodes={compareAfterNodes} />
            <FilterAction actions={filterAction} curIndex={curIndex} onClick={(i) => { setCurIndex(i) }} />
            <IndicatorDisplay compareNodes={compareAfterNodes} after={true} otherNodes={compareNodes} />
        </div>
    </Panel>;
}));
