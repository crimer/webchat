import React, { useContext } from 'react'
import { AccountContext } from '../Contexts/AccountContext'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { AccountCircle } from '@material-ui/icons'
import Box from '@material-ui/core/Box'
import { MenuItem } from '@material-ui/core'
import Menu from '@material-ui/core/Menu'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            gridRow: 1,
            gridColumn: 2,
            background: '#fff',
            color: '#111111',
        },
        menuButton: {
            marginRight: 36,
        },
        menuButtonHidden: {
            display: 'none',
        },
        toolbar: {
            paddingRight: 24, // keep right padding when drawer closed
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
    })
)

type HeaderProps = {}

const Header: React.FC<HeaderProps> = () => {
    const { authUser, logout } = useContext(AccountContext)
    const history = useHistory()
    const classes = useStyles()
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }
    const handleLogout = () => {
        setAnchorEl(null)
        logout()
        history.push('/login')
    }

    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography variant='h6' className={classes.title} noWrap>
                    MyChat
                </Typography>
                <Box className={classes.authBlock}>
                    {authUser.login !== '' && (
                        <Typography
                            variant='h6'
                            className={classes.userAccaunt}>
                            <AccountCircle className={classes.userIcon} />
                            {authUser.login}
                        </Typography>
                    )}

                    <Button
                        aria-controls='simple-menu'
                        aria-haspopup='true'
                        onClick={handleClick}>
                        Аккаунт
                    </Button>
                    <Menu
                        id='simple-menu'
                        anchorEl={anchorEl}
                        keepMounted
                        open={Boolean(anchorEl)}
                        onClose={handleClose}>
                        <MenuItem onClick={handleLogout}>Выйти</MenuItem>
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
