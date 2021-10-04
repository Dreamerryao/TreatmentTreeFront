import React from 'react';
import {FormControl, InputBase, makeStyles, MenuItem, Select, Typography, withStyles, Checkbox, ListItemText} from '@material-ui/core';

const MyInput = withStyles((theme) => ({
    root: {},
    input: {
        borderRadius: 4,
        position: 'relative',
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #ced4da',
        fontSize: 16,
        padding: '5px 26px 5px 12px',
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        // Use the system font instead of the default Roboto font.
        fontFamily: [
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Roboto',
            '"Helvetica Neue"',
            'Arial',
            'sans-serif',
            '"Apple Color Emoji"',
            '"Segoe UI Emoji"',
            '"Segoe UI Symbol"',
        ].join(','),
        '&:focus': {
            borderRadius: 4,
            borderColor: '#80bdff',
            boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
        },
    },
}))(InputBase);

const useStyles = makeStyles(theme => ({
    title: {
        lineHeight: '32px',
        marginRight: theme.spacing(1),
    },
    margin: {
        marginRight: theme.spacing(5),
    }
}));

export default function MySelect({title, value, options, multiple, ...props}) {
    const classes = useStyles();
    return <React.Fragment>
        <Typography className={classes.title}>{title}:</Typography>
        <FormControl className={classes.margin}>
            <Select input={<MyInput/>}
                    value={value}
                    multiple={multiple}
                    renderValue={selected => {
                        if (!multiple) return options[selected];
                        if (selected.length === 0) return 'please select the opponents';
                        if (selected.length === 1) return options[selected[0]];
                        if (selected.length === 2) return `${options[selected[0]]} and ${options[selected[1]]}`;
                        return `${options[selected[0]]} and ${selected.length - 1} others`;
                    }}
                    {...props}>
                {options.map((option, oId) => <MenuItem key={oId} value={oId}>
                    {!multiple ? option : <React.Fragment>
                        <Checkbox checked={value.includes(oId)} />
                        <ListItemText primary={option} />
                    </React.Fragment>}
                </MenuItem>)}
            </Select>
        </FormControl>
    </React.Fragment>;
};