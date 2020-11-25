import React, { useContext } from 'react'
import { AccountContext } from '../Contexts/AccountContext'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import { AccountCircle } from '@material-ui/icons'
import Box from '@material-ui/core/Box'

const useStyles = makeStyles(() =>
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
    const { authUser } = useContext(AccountContext)
    const classes = useStyles()

    return (
        <AppBar position='static' className={classes.root}>
            <Toolbar className={classes.toolbar}>
                <Typography variant='h6' className={classes.title} noWrap>
                    Mega Chat
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
                </Box>
            </Toolbar>
        </AppBar>
    )
}

export default Header
