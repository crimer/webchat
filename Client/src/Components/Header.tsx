import React, { useContext } from 'react'
import { LoginDialogContext } from '../Contexts/LoginDialogContext'
import '../styles/Header.css'
import { AccountContext } from '../Contexts/AccountContext'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import { AccountCircle } from '@material-ui/icons'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            gridRow: 1,
            gridColumn: 2,
            background: '#fff',
            color: '#111111'
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
    const { currentUserName, logout } = useContext(AccountContext)
    const { setIsDialogOpen } = useContext(LoginDialogContext)

    const classes = useStyles()

    const getLoginBlock = () => {
        if (currentUserName === '') {
            return (
                <Button color='inherit' onClick={() => setIsDialogOpen(true)}>
                    Войти
                </Button>
            )
        }

        return (
            <>
                <Typography variant='h6' className={classes.userAccaunt}>
                    <AccountCircle className={classes.userIcon} />
                    {currentUserName}
                </Typography>
                <Button onClick={logout} color='inherit'>
                    Выход
                </Button>
            </>
        )
    }

    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography variant='h6' className={classes.title} noWrap>
                    MyChat
                </Typography>
                <Box className={classes.authBlock}>{getLoginBlock()}</Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
