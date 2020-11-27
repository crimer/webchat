import {
    Divider,
    IconButton,
    InputBase,
    ListItem,
    ListItemText,
    makeStyles,
    Menu,
    MenuItem,
    Paper,
    Theme,
} from '@material-ui/core'
import Drawer from '@material-ui/core/Drawer/Drawer'
import React, { useContext, useEffect, useState } from 'react'
import GroupIcon from '@material-ui/icons/Group'
import ChatIcon from '@material-ui/icons/Chat'
import RadioIcon from '@material-ui/icons/Radio'
import CreateChatModal, { CreateChatType } from '../Components/CreateChatModal'
import { ChatContext } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { NavLink, useHistory } from 'react-router-dom'
import { ChatType, UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'

const drawerWidth = 320

const useStyles = makeStyles((theme: Theme) => ({
    drawer: {
        width: drawerWidth,
        gridColumn: 1,
        gridRow: 1,
    },
    drawerHeader: {
        display: 'flex',
        flexFlow: 'column nowrap',
        padding: theme.spacing(2),
    },
    drawerHeaderTop: {
        display: 'flex',
        flexFlow: 'row nowrap',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#2F343D',
        color: '#fff',
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
        color: '#fff',
    },
    searchWRapper: {
        backgroundColor: '#4a525f',
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        color: '#fff',
        marginLeft: theme.spacing(1),
        flex: 1,
    },
    iconButton: {
        color: '#fff',
        padding: 10,
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

    const openCreateChatMenu = (event: React.MouseEvent<HTMLButtonElement>) => setCreateChatMenu(event.currentTarget)
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
                <header className={classes.drawerHeader}>
                    <div className={classes.drawerHeaderTop}>
                        <h1>Mega Chat</h1>
                        <div className={classes.options}>
                            <div>
                                <IconButton
                                    aria-label='createChat'
                                    onClick={openCreateChatMenu}>
                                    <AddIcon
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
                            <div>
                                <IconButton
                                    className={classes.accountMenu}
                                    aria-controls='simple-menu'
                                    aria-haspopup='true'
                                    onClick={handleClick}>
                                    <AccountCircleIcon fontSize='default' />
                                </IconButton>
                                <Menu
                                    anchorEl={accountMenu}
                                    keepMounted
                                    open={Boolean(accountMenu)}
                                    onClose={handleCloseMenu}>
                                    <MenuItem onClick={navigateToProfile}>
                                        Профиль
                                    </MenuItem>
                                    <MenuItem onClick={handleLogout}>
                                        Выйти
                                    </MenuItem>
                                </Menu>
                            </div>
                        </div>
                    </div>
                    <div>
                        <SearchChats />
                    </div>
                </header>
                <ChannelList allChats={chats} />
            </Drawer>
        </aside>
    )
}
export default ChannelsBar

const SearchChats = () => {
    const classes = useStyles()
    return (
        <Paper component='div' className={classes.searchWRapper}>
            <InputBase
                fullWidth
                className={classes.input}
                aria-label='search'
                placeholder='Поиск здесь...'
            />
            <IconButton className={classes.iconButton} aria-label='search'>
                <SearchIcon />
            </IconButton>
        </Paper>
    )
}

const ChannelList: React.FC<{ allChats: UserChatDto[] }> = ({ allChats }) => {
    const classes = useStyles()

    return (
        <>
            <Divider />
            {allChats.map((chat: UserChatDto) => (
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

const ChannelItem: React.FC<{ chatItem: UserChatDto }> = ({ chatItem }) => {
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
