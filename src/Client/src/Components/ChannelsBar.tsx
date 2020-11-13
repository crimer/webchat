import {
    createStyles,
    Divider,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Theme,
    Typography,
    useTheme,
} from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer/Drawer'
import React, { useState } from 'react'

const drawerWidth = 320

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        width: drawerWidth,
        gridColumn: 1,
        gridRow: 1,
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#2F343D',
        color: '#fff',
    },
    drawerHeader: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        ...theme.mixins.toolbar,
    },
}))

type ChannelsBarProps = {}

const ChannelsBar: React.FC<ChannelsBarProps> = () => {
    const classes = useStyles()
    const theme = useTheme()

    return (
        <Drawer
            variant='permanent'
            className={classes.drawer}
            classes={{
                paper: classes.drawerPaper,
            }}
            anchor='left'>
            <div className={classes.drawerHeader}>
                <Typography>Чаты:</Typography>
            </div>
            <Divider />
            <List>
                {[
                    'DotNetChatRu',
                    'VueJs',
                    'React RU',
                    'Xamarin Developers',
                ].map((text, index) => (
                    <ListItem button key={text}>
                        <ListItemIcon>
                            {/* {index % 2 === 0 ? <InboxIcon /> : <MailIcon />} */}
                        </ListItemIcon>
                        <ListItemText primary={text} />
                    </ListItem>
                ))}
            </List>
        </Drawer>
    )
}
export default ChannelsBar
