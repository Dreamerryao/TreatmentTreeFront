import React from 'react';
import {inject, observer} from 'mobx-react';
import {IconButton, makeStyles, Popover, Typography} from '@material-ui/core';
import {Settings} from "@material-ui/icons";

const titleHeight = 32;
const useStyles = makeStyles(theme => {
    const diffSize = theme.shape.borderRadius * (2 - Math.sqrt(2)) / 2;
    const triangleSize = titleHeight - diffSize;
    return {
        panel: {
            borderRadius: theme.shape.borderRadius,
            backgroundColor: theme.palette.background.paper,
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        },
        titleBar: {
            height: titleHeight,
            display: 'flex',
        },
        title: {
            flexShrink: 0,
            flexGrow: 0,
            marginRight: titleHeight,
            borderRadius: `0 0 ${theme.shape.borderRadius}px 0`,
            backgroundColor: theme.palette.background.default,
            padding: theme.spacing((titleHeight - 28) / 20, 0.5, (titleHeight - 28) / 20, 1),
            position: 'relative',
        },
        triangle: {
            position: 'absolute',
            width: 0,
            height: 0,
            top: 0,
            right: diffSize - triangleSize,
            borderTop: `${triangleSize}px solid ${theme.palette.background.default}`,
            borderRight: `${triangleSize}px solid ${theme.palette.background.paper}`,
        },
        tools: {
            display: 'flex',
            flexGrow: 1,
            flexShrink: 1,
            overflowX: 'auto',
            justifyContent: 'flex-end',
        },
        tool: {
            marginRight: theme.spacing(1),
            height: '100%',
            maxHeight: '100%',
            overflow: 'hidden',
        },
        content: {
            height: `calc(100% - ${titleHeight}px)`,
            width: '100%',
        },
        settingsForm: {
            "& td": {
                width: 100,
                padding: theme.spacing(0, 1),
            }
        }
    };
});

export default inject()(observer(function Panel({title, tools, children, settings}) {
    const classes = useStyles();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const handleClickSettings = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseSettings = () => {
        setAnchorEl(null);
    };
    const open = Boolean(anchorEl);

    return <div className={classes.panel}>
        <div className={classes.titleBar}>
            {/*<div className={classes.title}>*/}
            {/*    <Typography variant={'subtitle1'}>{title}</Typography>*/}
            {/*    <div className={classes.triangle}/>*/}
            {/*</div>*/}
            <div className={classes.tools}>
                {!!tools && tools.map((tool, tId) => <div key={tId} className={classes.tool}>{tool}</div>)}
            </div>
            {settings && <>
                <IconButton size={"small"}
                            onClick={handleClickSettings}><Settings/></IconButton>
                <Popover open={open} onClose={handleCloseSettings}
                         anchorEl={anchorEl}
                         anchorOrigin={{
                             vertical: 'bottom',
                             horizontal: 'right',
                         }}
                         transformOrigin={{
                             vertical: 'top',
                             horizontal: 'right',
                         }}>
                    <table className={classes.settingsForm}>
                        <tbody>
                        {settings.map(({name, control}) => <tr key={name}>
                            <th>{name}</th>
                            <td>{control}</td>
                        </tr>)}
                        </tbody>
                    </table>
                </Popover>
            </>}
        </div>
        <div className={classes.content}>
            {children}
        </div>
    </div>;
}));
