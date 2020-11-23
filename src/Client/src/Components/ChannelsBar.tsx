import {
    Divider,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
    Typography,
} from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import Drawer from '@material-ui/core/Drawer/Drawer'
import React, { useState } from 'react'
import GroupIcon from '@material-ui/icons/Group'
import ChatIcon from '@material-ui/icons/Chat'
import RadioIcon from '@material-ui/icons/Radio'
import CreateChatModal, {ChatTypes,CreateChatType} from '../Components/CreateChatModal'



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
    options: {
        padding: theme.spacing(1),
    },
    createChatIcon: {
        color: '#00e676',
    },
    chatIcon: {
        marginRight: '10px',
    },
    avatarSize: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        fontSize: '45px',
    },
    gridItem: {
        minWidth: '500px',
    },
    paper: {
        padding: theme.spacing(3, 2),
    },
}))

type ChannelsBarProps = {}

const ChannelsBar: React.FC<ChannelsBarProps> = () => {
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
    const [isCreateChatOpen, setCreateChatOpen] = useState<boolean>(false)
    const [selectedChatType, setSelectedChatType] = useState<CreateChatType | undefined>()

    const channels = ['DotNetChatRu', 'VueJs', 'React RU', 'Xamarin Developers']

    const channelTypes: CreateChatType[] = [
        {
            id: 1,
            type: ChatTypes.Group,
            text: 'Группа',
            icon: <GroupIcon className={classes.chatIcon} />,
        },
        {
            id: 2,
            type: ChatTypes.Channel,
            text: 'Канал',
            icon: <RadioIcon className={classes.chatIcon} />,
        },
        {
            id: 3,
            type: ChatTypes.Direct,
            text: 'Личная переписка',
            icon: <ChatIcon className={classes.chatIcon} />,
        },
    ]
    const openCreateChatMenu = (event: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(event.currentTarget)
    const handleClose = () => setAnchorEl(null)

    const selectChatType = (chatType: CreateChatType) => {
        setAnchorEl(null)
        setCreateChatOpen(true)
        setSelectedChatType(chatType)
    }
    const modalClose = () => {
        setCreateChatOpen(false)
        setSelectedChatType(undefined)
    }

    return (
        <>
            <CreateChatModal open={isCreateChatOpen} createChatType={selectedChatType} onModalClose={modalClose}/>
            <Drawer
                variant='permanent'
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='left'>
                <div className={classes.options}>
                    <IconButton
                        aria-label='createChat'
                        onClick={openCreateChatMenu}>
                        <CreateIcon
                            fontSize='default'
                            className={classes.createChatIcon}
                        />
                    </IconButton>
                    <Menu
                        id='create-chats-menu'
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        {channelTypes.map((type) => (
                            <MenuItem
                                onClick={() => selectChatType(type)}
                                key={type.type}>
                                {type.icon}
                                {type.text}
                            </MenuItem>
                        ))}
                    </Menu>
                </div>
                <div className={classes.drawerHeader}>
                    <Typography>Чаты:</Typography>
                </div>
                <Divider />
                <List>
                    {channels.map((text) => (
                        <ListItem button key={text}>
                            <ListItemIcon>
                            </ListItemIcon>
                            <ListItemText primary={text} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </>
    )
}
export default ChannelsBar
