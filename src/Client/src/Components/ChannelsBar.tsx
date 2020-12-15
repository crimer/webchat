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
import RadioIcon from '@material-ui/icons/Radio'
import { CreateChatModal } from './Modals/CreateChatModal'
import { ChatType, UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import { ChatContext } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { NavLink, useHistory } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import AddIcon from '@material-ui/icons/Add'
import SearchIcon from '@material-ui/icons/Search'
import MeetingRoomIcon from '@material-ui/icons/MeetingRoom'
import { ReturnToChatModal } from './Modals/ReturnToChatModal'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import { CreateDirectModal } from './Modals/CreateDirectModal'

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
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: '#2F343D',
        color: '#fff',
    },
    appName:{
      margin: '0',
    },
    options: {
        padding: theme.spacing(1),
        display: 'flex',
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'space-between',
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
    iconColor: {
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
    emptyChats: {
        textAlign: 'center',
    },
}))

type ChannelsBarProps = {}

export const ChannelsBar: React.FC<ChannelsBarProps> = () => {
    const classes = useStyles()
    const history = useHistory()

    const { getChatsByUserId, chats } = useContext(ChatContext)
    const { authUser, logout } = useContext(AccountContext)

    const [accountMenu, setAccountMenu] = useState<null | HTMLElement>(null)
    const [searchValue, setSearchValue] = useState<string>('')

    const [isCreareModalOpen, setIsCreareModalOpen] = useState<boolean>(false)
    const [isReturnChatModalOpen, setIsReturnChatModalOpen] = useState<boolean>(false)
    const [isDirectModalOpen, setIsDirectModalOpen] = useState<boolean>(false)

    const createModalClose = () => setIsCreareModalOpen(false)
    const returnModalClose = () => setIsReturnChatModalOpen(false)
    const directModalClose = () => setIsDirectModalOpen(false)

    const openAccountMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
        setAccountMenu(event.currentTarget)
    const closeAccountMenu = () => setAccountMenu(null)

    const filteredChats = chats.filter((chat) =>
        chat.name.toLowerCase().includes(searchValue.toLowerCase())
    )

    const handleLogout = () => {
        setAccountMenu(null)
        logout().then((res) => {
            history.push('/login')
        })
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
                open={isCreareModalOpen}
                onModalClose={createModalClose}
            />
            <ReturnToChatModal
                open={isReturnChatModalOpen}
                onModalClose={returnModalClose}
            />
            <CreateDirectModal
                open={isDirectModalOpen}
                onModalClose={directModalClose}
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
                        <h1 className={classes.appName}>Mega Chat</h1>
                        <div className={classes.options}>
                            <div>
                                <IconButton
                                    aria-label='createChat'
                                    onClick={() => setIsDirectModalOpen(true)}>
                                    <MailOutlineIcon
                                        fontSize='default'
                                        className={classes.iconColor}
                                    />
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    aria-label='createChat'
                                    onClick={() => setIsCreareModalOpen(true)}>
                                    <AddIcon
                                        fontSize='default'
                                        className={classes.iconColor}
                                    />
                                </IconButton>
                            </div>
                            <div>
                                <IconButton
                                    aria-label='createChat'
                                    onClick={() =>
                                        setIsReturnChatModalOpen(true)
                                    }>
                                    <MeetingRoomIcon
                                        fontSize='default'
                                        className={classes.iconColor}
                                    />
                                </IconButton>
                            </div>
                            <div>
                            <IconButton
                                className={classes.iconColor}
                                aria-controls='simple-menu'
                                aria-haspopup='true'
                                onClick={openAccountMenu}>
                                <AccountCircleIcon fontSize='default' />
                            </IconButton>
                            <Menu
                                anchorEl={accountMenu}
                                keepMounted
                                open={Boolean(accountMenu)}
                                onClose={closeAccountMenu}>
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
                        <SearchChats
                            searchQuery={searchValue}
                            onChangeSearch={setSearchValue}
                        />
                    </div>
                </header>
                <ChannelList allChats={filteredChats} />
            </Drawer>
        </aside>
    )
}

type SearchChatsProps = {
    searchQuery: string
    onChangeSearch: (value: string) => void
}

const SearchChats: React.FC<SearchChatsProps> = ({
    searchQuery,
    onChangeSearch,
}) => {
    const classes = useStyles()

    return (
        <Paper component='div' className={classes.searchWRapper}>
            <InputBase
                fullWidth
                value={searchQuery || ''}
                onChange={(e) => onChangeSearch(e.target.value)}
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
            {allChats.length === 0 && (
                <p className={classes.emptyChats}>Чатов нет</p>
            )}
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
                <MailOutlineIcon className={classes.chatIcon} />
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
