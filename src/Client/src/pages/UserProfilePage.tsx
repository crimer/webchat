import {
    Container,
    Typography,
    Grid,
    makeStyles,
    Paper,
    Avatar,
    TextField,
    IconButton,
} from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import usersRepository from '../repository/UsersRepository'
import { UserProfileDto } from '../common/Dtos/User/UserDtos'
import { AccountContext } from '../Contexts/AccountContext'
import { ToastContext } from '../Contexts/ToastContext'

const useStyles = makeStyles((theme) => ({
    heroContent: {
        backgroundColor: theme.palette.background.paper,
        padding: theme.spacing(8, 0, 6),
        width: '100%',
        height: '100vh',
    },
    avatarSize: {
        width: theme.spacing(15),
        height: theme.spacing(15),
        fontSize: '45px',
    },
    gridItem: {
        maxWidth: '500px',
    },
    iconBack: {
        marginLeft: '20px',
    },
    paper: {
        padding: theme.spacing(3, 2),
    },
    userName: {
        marginTop: '20px',
        fontSize: '20px',
        textAlign: 'center',
    },
    changePassBtn: {
        marginLeft: '20px',
        backgroundColor: '#f58800',
        color: '#fff',
        '&:hover': {
            backgroundColor: '#ca7000',
        },
    },
}))

export const UserFrofilePage = () => {
    const classes = useStyles()
    const history = useHistory()
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)
    const [userData, setUserData] = useState<UserProfileDto>()

    useEffect(() => {
        const fetchProfile = async () => {
            const response = await usersRepository
                .getUserProfile<UserProfileDto>(authUser.id)
                .catch(() => {
                    openToast({
                        body:
                            'Извините, не удалось подключиться к серверу, повторите попытку позже',
                        type: 'error',
                    })
                    history.push('/chat/')
                })

            if (response && response.isValid) {
                setUserData(response.data)
                console.log(response.data)
            } else if (response) {
                openToast({
                    body: `Не удалось получить данные профиля`,
                    type: 'error',
                })
                history.push('/chat/')
            }
        }
        fetchProfile()
    }, [])

    return (
        <main>
            <div className={classes.heroContent}>
                <Container>
                    <Grid container direction='row' alignItems='center'>
                        <IconButton
                            onClick={() => history.goBack()}
                            aria-label='delete'
                            className={classes.iconBack}>
                            <KeyboardBackspaceIcon fontSize='large' />
                        </IconButton>
                        <Typography
                            component='h1'
                            variant='h4'
                            align='left'
                            color='textPrimary'>
                            Профиль
                        </Typography>
                    </Grid>
                    {userData && (
                        <div>
                            <Grid container spacing={2} justify='center'>
                                <Grid item className={classes.gridItem}>
                                    <Paper className={classes.paper}>
                                        <Avatar
                                            alt={userData.login}
                                            className={classes.avatarSize}>
                                            {userData.login[0]}
                                        </Avatar>
                                        <p className={classes.userName}>
                                            {userData.login}
                                        </p>
                                    </Paper>
                                </Grid>

                                <Grid item className={classes.gridItem}>
                                    <Paper className={classes.paper}>
                                        <div>
                                            <TextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                fullWidth
                                                id='login'
                                                label='Логин'
                                                name='login'
                                                value={userData.login}
                                                disabled
                                            />
                                            <TextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                disabled
                                                fullWidth
                                                name='password'
                                                label='Пароль'
                                                type='password'
                                                id='password'
                                                value={userData.password}
                                            />
                                        </div>
                                    </Paper>
                                </Grid>
                            </Grid>
                        </div>
                    )}
                </Container>
            </div>
        </main>
    )
}
