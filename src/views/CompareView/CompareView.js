import React, { useRef } from 'react';
import { inject, observer } from 'mobx-react';
import {makeStyles, Typography} from '@material-ui/core';
import Panel from "../../components/Panel";
import IndicatorDisplay from './components/IndicatorDisplay';
import FilterAction from './components/FilterAction';
import MySelect from "../TitleBar/MySelect";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";


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
    title: {
        lineHeight: '32px',
        marginRight: theme.spacing(1),
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

    const targets = d.interestFeatures;
    const setTargets = ({
                            target: { value },
                        }) => d.setInterestFeatures(value);
    const allOptions = !!d.detailIndex[d.dataset] ? d.detailIndex[d.dataset].map(index => index['column_name']) : [];
    return <Panel title="Detail View" tools={[
            <Typography className={classes.title}>Features of Interest:</Typography>,
            <div>
                <FormControl>
                    <Select
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={targets}
                        onChange={setTargets}
                        renderValue={(selected) => selected.join(', ').slice(0, 10).concat('...')}
                    >
                        {allOptions.map((name) => (
                            <MenuItem key={name} value={name}>
                                <Checkbox checked={targets.indexOf(name) > -1} />
                                <ListItemText primary={name} />
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </div>]}>
        <div className={classes.container}>
            <IndicatorDisplay compareNodes={compareNodes} otherNodes={compareAfterNodes} />
            <FilterAction actions={filterAction} curIndex={curIndex} onClick={(i) => { setCurIndex(i) }} />
            {/*<IndicatorDisplay compareNodes={compareAfterNodes} after={true} otherNodes={compareNodes} />*/}
        </div>
    </Panel>;
}));
