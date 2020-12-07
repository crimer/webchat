import {
    Container,
    Typography,
    Grid,
    Button,
    makeStyles,
    Paper,
    Avatar,
    TextField,
    IconButton,
} from '@material-ui/core'
import React, { FormEvent, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'

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
    const data = {
        login: 'Nikita@mail.ru',
        name: 'nikita',
        password: '',
        newPassword: '',
        repeatNewPassword: '',
        avatarPath: '',
        shortName: 'N',
    }
    const { id } = useParams()
    const classes = useStyles()
    const history = useHistory()
    const [userData, setUserData] = useState(data)
    const [changePassword, setChangePassword] = useState(false)

    const submitChangeProfile = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submitChangeProfile form')
    }

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
                    <div>
                        <Grid container spacing={2} justify='center'>
                            <Grid item className={classes.gridItem}>
                                <Paper className={classes.paper}>
                                    {userData.avatarPath === '' ? (
                                        <Avatar
                                            alt={userData.name}
                                            className={classes.avatarSize}>
                                            {userData.shortName}
                                        </Avatar>
                                    ) : (
                                        <Avatar
                                            className={classes.avatarSize}
                                            alt={userData.name}
                                            src={userData.avatarPath}
                                        />
                                    )}

                                    <p className={classes.userName}>
                                        {userData.name}
                                    </p>
                                </Paper>
                            </Grid>
                            <Grid item className={classes.gridItem}>
                                <Paper className={classes.paper}>
                                    <form
                                        noValidate
                                        onSubmit={submitChangeProfile}>
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            required
                                            fullWidth
                                            id='name'
                                            label='Имя'
                                            name='name'
                                            value={userData.name}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    name: e.target.value,
                                                })
                                            }
                                        />
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            required
                                            fullWidth
                                            id='login'
                                            label='Логин'
                                            name='login'
                                            value={userData.login}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    login: e.target.value,
                                                })
                                            }
                                        />
                                        <TextField
                                            variant='outlined'
                                            margin='normal'
                                            required
                                            disabled={!changePassword}
                                            fullWidth
                                            name='password'
                                            label='Пароль'
                                            type='password'
                                            id='password'
                                            value={userData.password}
                                            onChange={(e) =>
                                                setUserData({
                                                    ...userData,
                                                    password: e.target.value,
                                                })
                                            }
                                        />
                                        {changePassword && (
                                            <div>
                                                <TextField
                                                    variant='outlined'
                                                    margin='normal'
                                                    fullWidth
                                                    name='newPassword'
                                                    label='Новый пароль'
                                                    type='password'
                                                    id='newPassword'
                                                    value={userData.newPassword}
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            newPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                                <TextField
                                                    variant='outlined'
                                                    margin='normal'
                                                    fullWidth
                                                    name='repeatNewPassword'
                                                    label='Повторите новый пароль'
                                                    type='password'
                                                    id='repeatNewPassword'
                                                    value={
                                                        userData.repeatNewPassword
                                                    }
                                                    onChange={(e) =>
                                                        setUserData({
                                                            ...userData,
                                                            repeatNewPassword:
                                                                e.target.value,
                                                        })
                                                    }
                                                />
                                            </div>
                                        )}

                                        <Button
                                            type='submit'
                                            variant='contained'
                                            color='primary'>
                                            Сохранить
                                        </Button>
                                        <Button
                                            onClick={() => {
                                                setChangePassword(
                                                    !changePassword
                                                )
                                            }}
                                            className={classes.changePassBtn}
                                            variant='contained'>
                                            Изменить пароль
                                        </Button>
                                    </form>
                                </Paper>
                            </Grid>
                        </Grid>
                    </div>
                </Container>
            </div>
        </main>
    )
}

