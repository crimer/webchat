import React, { useContext, useState } from 'react'
import { AccountContext } from '../Contexts/AccountContext'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { AccountCircle } from '@material-ui/icons'
import Box from '@material-ui/core/Box'
import {
    IconButton,
    MenuItem,
    Menu,
    FormControl,
    InputLabel,
    Select,
} from '@material-ui/core'
import { useHistory } from 'react-router-dom'
import MoreVertIcon from '@material-ui/icons/MoreVert'
import { ChatContext } from '../Contexts/ChatContext'
import ToggleButton from '@material-ui/lab/ToggleButton'
import AttachmentOutlinedIcon from '@material-ui/icons/AttachmentOutlined'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            gridRow: 1,
            gridColumn: 2,
            background: '#fff',
            color: '#111111',
        },
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
        menuButton: {
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
        toolbar: {
            paddingRight: 24,
        },
        title: {
            flexGrow: 1,
        },
        authBlock: {
            display: 'flex',
        },
        userAccaunt: {
            marginRight: '20px',
            display: 'flex',
            alignItems: 'center',
        },
        userIcon: {
            marginRight: '10px',
        },
        accountMenu: {
            backgroundColor: '#4a525f',
            color: '#fff',
        },
        moreIconMenu: {
            color: '#000',
        },
        togglePinnedBtn:{
            marginRight: '20px',
        },
    })
)

type HeaderProps = {}

const Header: React.FC<HeaderProps> = () => {
    const { authUser } = useContext(AccountContext)
    const { isPinned, setPinned } = useContext(ChatContext)
    const classes = useStyles()
    const history = useHistory()
    const [channelMenu, setChannelMenu] = useState<null | HTMLElement>(null)
    const handleClose = () => setChannelMenu(null)
    const openCreateChatMenu = (event: React.MouseEvent<HTMLButtonElement>) =>
        setChannelMenu(event.currentTarget)

    const toDetailPage = (chatId: number) => {
        history.push(`/chat/${chatId}/detail`)
    }

    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography variant='h6' className={classes.title} noWrap>
                    Mega Chat
                </Typography>
                <ToggleButton
                    className={classes.togglePinnedBtn}
                    value='check'
                    size='small'
                    selected={isPinned}
                    onChange={() => {
                        setPinned(!isPinned)
                    }}>
                    {isPinned ? (
                        <AttachmentOutlinedIcon />
                    ) : (
                        <TextsmsOutlinedIcon />
                    )}
                </ToggleButton>
                <Box className={classes.authBlock}>
                    {authUser.login !== '' && (
                        <Typography
                            variant='h6'
                            className={classes.userAccaunt}>
                            <AccountCircle className={classes.userIcon} />
                            {authUser.login}
                        </Typography>
                    )}
                </Box>

                <IconButton
                    aria-label='createChat'
                    onClick={openCreateChatMenu}>
                    <MoreVertIcon
                        fontSize='small'
                        className={classes.moreIconMenu}
                    />
                </IconButton>
                <Menu
                    anchorEl={channelMenu}
                    keepMounted
                    open={Boolean(channelMenu)}
                    onClose={handleClose}>
                    <MenuItem onClick={() => toDetailPage(1)}>
                        Детально
                    </MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    )
}

export default Header
