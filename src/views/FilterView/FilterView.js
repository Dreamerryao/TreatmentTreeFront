
import React, { useCallback, useMemo, useRef } from 'react';
import { inject, observer } from 'mobx-react';
import { makeStyles, Button, Typography, FormControlLabel, FormControl, FormLabel, Radio, RadioGroup, Slider } from '@material-ui/core';
import Panel from "../../components/Panel";
import { Check, Refresh } from "@material-ui/icons";
import parseRateColor from '../../utils/parseRateColor';
const useStyles = makeStyles(theme => ({
    text: {
        fontSize: 10,
        height: 32,
        lineHeight: '32px',
    },
    action: {
        minWidth: 0,
        height: 32,
        width: 32,
    },
}));

export default inject('d')(observer(function ({ d }) {

    const classes = useStyles();
    return <Panel title={'Filter View'} tools={[<Button className={classes.action}
        color={'primary'}
        onClick={() => d.onFilterSubmit()}
    >
        <Check />
    </Button>, <Button className={classes.action}
        color={'primary'}
        onClick={() => d.onFilterRefresh()}
    >
        <Refresh />
    </Button>]}>
        <div style={{ padding: 10 }}>
            <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup row aria-label="gender" name="row-radio-buttons-group" value={d.gender} onChange={(e) => { d.changeGender(e.target.value) }}>
                    <FormControlLabel value="0" control={<Radio />} label="Female" />
                    <FormControlLabel value="1" control={<Radio />} label="Male" />
                </RadioGroup>
            </FormControl>
            <FormLabel component="legend">Age</FormLabel>
            <Slider
                value={d.age}
                onChange={(e, newV) => { d.changeAge(newV) }}
                valueLabelDisplay="auto"
                min={d.ageRange[0]}
                max={d.ageRange[1]}
            />
            <FormLabel component="legend">Weight</FormLabel>
            <Slider
                value={d.weight}
                onChange={(e, newV) => { d.changeWeight(newV) }}
                valueLabelDisplay="auto"
                min={d.weightRange[0]}
                max={d.weightRange[1]}
            />
            {
                d.recordsState['MIMIC-IV'] && d.filterRecordsIndex && d.filterRecordsIndex.map((rId) => {
                    return <div key={rId} style={{ display: 'flex',marginTop:5, marginBottom:5,cursor:'pointer'}} onClick={()=>{d.initData('MIMIC-IV', rId)}}>
                        {
                            d.recordsState['MIMIC-IV'][rId]['status'].map((record, eId) => {
                                return <div key={`${rId},${eId}`} style={{ background: parseRateColor(record.mortality - 0.3 > 0.5 ? 0.5 : record.mortality - 0.3, d.mortalityColor), width:10, height:10 }}> </div>
                            })
                        }
                    </div>
                })
            }
        </div>
    </Panel>;
}));
