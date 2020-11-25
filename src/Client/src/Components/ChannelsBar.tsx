import {
    Button,
    Divider,
    IconButton,
    ListItem,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Theme,
    Typography,
} from '@material-ui/core'
import CreateIcon from '@material-ui/icons/Create'
import Drawer from '@material-ui/core/Drawer/Drawer'
import React, { useContext, useEffect, useState } from 'react'
import GroupIcon from '@material-ui/icons/Group'
import ChatIcon from '@material-ui/icons/Chat'
import RadioIcon from '@material-ui/icons/Radio'
import CreateChatModal, { CreateChatType } from '../Components/CreateChatModal'
import { ChatContext, ChatType, UserChat } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { NavLink, useHistory } from 'react-router-dom'

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
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    chatLink: {
        textDecoration: 'none',
        color: '#fff',
    },
    activeChat: {
        backgroundColor: '#4a525f',
    },
    accountMenu: {
        backgroundColor: '#4a525f',
        color: '#fff',
    },
}))

type ChannelsBarProps = {}

const ChannelsBar: React.FC<ChannelsBarProps> = () => {
    const classes = useStyles()
    const history = useHistory()

    const { getChatsByUserId, chats } = useContext(ChatContext)
    const { authUser, logout } = useContext(AccountContext)

    const [accountMenu, setAccountMenu] = useState<null | HTMLElement>(null)
    const [createChatMenu, setCreateChatMenu] = useState<null | HTMLElement>(
        null
    )

    const [isCreateChatOpen, setCreateChatOpen] = useState<boolean>(false)
    const [selectedChatType, setSelectedChatType] = useState<
        | {
              type: ChatType
              text: string
          }
        | undefined
    >()

    const channelTypes: CreateChatType[] = [
        {
            id: 1,
            type: ChatType.Group,
            text: 'Группа',
            icon: <GroupIcon className={classes.chatIcon} />,
        },
        {
            id: 2,
            type: ChatType.Channel,
            text: 'Канал',
            icon: <RadioIcon className={classes.chatIcon} />,
        },
        {
            id: 3,
            type: ChatType.Direct,
            text: 'Личная переписка',
            icon: <ChatIcon className={classes.chatIcon} />,
        },
    ]
    const openCreateChatMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
        setCreateChatMenu(event.currentTarget)
    const handleClose = () => setCreateChatMenu(null)

    const selectChatType = (chatType: { type: ChatType; text: string }) => {
        setCreateChatMenu(null)
        setCreateChatOpen(true)
        setSelectedChatType(chatType)
        console.log(chatType)
    }
    const modalClose = () => {
        setCreateChatOpen(false)
        setSelectedChatType(undefined)
    }

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAccountMenu(event.currentTarget)
    }

    const handleCloseMenu = () => {
        setAccountMenu(null)
    }
    const handleLogout = () => {
        setAccountMenu(null)
        logout()
        history.push('/login')
    }
    const navigateToProfile = () => {
        setAccountMenu(null)
        history.push(`/profile/${authUser.id}`)
    }

    useEffect(() => {
        if (authUser.id !== -1) getChatsByUserId(authUser.id)
    }, [authUser.id])

    return (
        <aside>
            <CreateChatModal
                open={isCreateChatOpen}
                createChatType={selectedChatType}
                onModalClose={modalClose}
            />
            <Drawer
                variant='permanent'
                className={classes.drawer}
                classes={{
                    paper: classes.drawerPaper,
                }}
                anchor='left'>
                <div className={classes.options}>
                    <div>
                        <Button
                            className={classes.accountMenu}
                            aria-controls='simple-menu'
                            aria-haspopup='true'
                            onClick={handleClick}>
                            Аккаунт
                        </Button>
                        <Menu
                            anchorEl={accountMenu}
                            keepMounted
                            open={Boolean(accountMenu)}
                            onClose={handleCloseMenu}>
                            <MenuItem onClick={navigateToProfile}>
                                Профиль
                            </MenuItem>
                            <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                        </Menu>
                    </div>
                    <div>
                        <IconButton
                            aria-label='createChat'
                            onClick={openCreateChatMenu}>
                            <CreateIcon
                                fontSize='default'
                                className={classes.createChatIcon}
                            />
                        </IconButton>
                        <Menu
                            anchorEl={createChatMenu}
                            keepMounted
                            open={Boolean(createChatMenu)}
                            onClose={handleClose}>
                            {channelTypes.map((type) => (
                                <MenuItem
                                    onClick={() =>
                                        selectChatType({
                                            text: type.text,
                                            type: type.type,
                                        })
                                    }
                                    key={type.type}>
                                    {type.icon}
                                    {type.text}
                                </MenuItem>
                            ))}
                        </Menu>
                    </div>
                </div>
                <ChannelList allChats={chats} />
            </Drawer>
        </aside>
    )
}
export default ChannelsBar

const ChannelList: React.FC<{ allChats: UserChat[] }> = ({ allChats }) => {
    const classes = useStyles()

    const groups = allChats.filter((chat) => chat.chatType === ChatType.Group)
    const channels = allChats.filter(
        (chat) => chat.chatType === ChatType.Channel
    )
    const directs = allChats.filter((chat) => chat.chatType === ChatType.Direct)

    return (
        <>
            <Divider />
            <div className={classes.drawerHeader}>
                <Typography>
                    Каналы: {channels.length === 0 && 'нет'}
                </Typography>
            </div>
            {channels.map((chat: UserChat) => (
                <NavLink
                    to={`/chat/${chat.id}`}
                    className={classes.chatLink}
                    activeClassName={classes.activeChat}
                    key={chat.id}>
                    <ChannelItem chatItem={chat} />
                </NavLink>
            ))}

            <Divider />
            <div className={classes.drawerHeader}>
                <Typography>Группы: {groups.length === 0 && 'нет'}</Typography>
            </div>
            {groups.map((chat: UserChat) => (
                <NavLink
                    to={`/chat/${chat.id}`}
                    className={classes.chatLink}
                    activeClassName={classes.activeChat}
                    key={chat.id}>
                    <ChannelItem chatItem={chat} />
                </NavLink>
            ))}

            <Divider />
            <div className={classes.drawerHeader}>
                <Typography>
                    Directs: {directs.length === 0 && 'нет'}
                </Typography>
            </div>
            {directs.map((chat: UserChat) => (
                <NavLink
                    to={`/chat/${chat.id}`}
                    className={classes.chatLink}
                    activeClassName={classes.activeChat}
                    key={chat.id}>
                    <ChannelItem chatItem={chat} />
                </NavLink>
            ))}
        </>
    )
}

const ChannelItem: React.FC<{ chatItem: UserChat }> = ({ chatItem }) => {
    const classes = useStyles()
    return (
        <ListItem button>
            {chatItem.chatType === ChatType.Direct && (
                <ChatIcon className={classes.chatIcon} />
            )}
            {chatItem.chatType === ChatType.Channel && (
                <RadioIcon className={classes.chatIcon} />
            )}
            {chatItem.chatType === ChatType.Group && (
                <GroupIcon className={classes.chatIcon} />
            )}
            <ListItemText primary={chatItem.name} />
        </ListItem>
    )
}
