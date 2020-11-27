import React, { FormEvent, useContext, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { Link, useHistory } from 'react-router-dom'
import { AccountContext } from '../Contexts/AccountContext'
import SignalRManager from '../SignalR/SignalRManager'
import { ToastContext } from '../Contexts/ToastContext'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

export const LoginPage: React.FC = () => {
    const classes = useStyles()
    const history = useHistory()
    const [auth, setAuth] = useState({ login: '', password: '' })
    const { login } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)
    const [disable, setDisable] = useState(false)

    const submitLogin = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDisable(true)
        if (auth.login.trim().length === 0 || auth.password.trim().length === 0) {
            setAuth({ login: '', password: '' })
            openToast({body: 'Логин или пароль не должны быть пустыми'})
            setDisable(false)
            return
        }
        const isLogin = await login(auth.login, auth.password)
        if (isLogin) {
            await SignalRManager.instance.reconnect()
            openToast({ body:'Вы вошли' })
            setAuth({ login: '', password: '' })
            history.push('/chat/')
        }
        setDisable(false)
    }

    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Авторизация
                </Typography>
                <form
                    className={classes.form}
                    noValidate
                    onSubmit={submitLogin}>
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        disabled={disable}
                        fullWidth
                        value={auth.login}
                        onChange={(e) =>
                            setAuth({ ...auth, login: e.target.value })
                        }
                        id='login'
                        label='Логин'
                        name='login'
                        autoFocus
                    />
                    <TextField
                        variant='outlined'
                        margin='normal'
                        required
                        disabled={disable}
                        value={auth.password}
                        fullWidth
                        onChange={(e) =>
                            setAuth({ ...auth, password: e.target.value })
                        }
                        name='password'
                        label='Пароль'
                        type='password'
                        id='password'
                    />
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        disabled={disable}
                        className={classes.submit}>
                        Войти
                    </Button>
                    <Grid container justify='flex-end'>
                        <Grid item>
                            <Link to='/register'>
                                Нет аккаутна? Зерегестрируйтесь
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}
