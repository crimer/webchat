import React, { FormEvent, useContext, useState } from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Link, useHistory } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'
import { AccountContext } from '../Contexts/AccountContext'
import { ModalContext } from '../Contexts/ModalContext'

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}))

const RegisterPage = () => {
    const classes = useStyles()
    const history = useHistory()
    const [auth, setAuth] = useState({ login: '', password: '', repeatPassword: '' })
    const { register } = useContext(AccountContext)
    const { openModal } = useContext(ModalContext)

    const submitRegister = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (auth.login.trim().length === 0 || auth.password.trim().length === 0 || auth.repeatPassword.trim().length === 0) {
            setAuth({ login: '', password: '', repeatPassword: '' })
            openModal('Внимание!', 'Логин или пароль не должны быть пустыми')
            return
        }
        if(auth.password !== auth.repeatPassword) {
            openModal('Внимание!', 'Пароли должны совпадать')
            return
        }
        const isRegister = await register(auth.login, auth.password)
        if (isRegister) {
            setAuth({ login: '', password: '', repeatPassword: '' })
            history.push('/login')
        }
    }

    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Регистрация
                </Typography>
                <form className={classes.form} noValidate onSubmit={submitRegister}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                value={auth.login}
                                onChange={(e)=> setAuth({...auth, login: e.target.value})}
                                variant='outlined'
                                required
                                fullWidth
                                id='login'
                                label='Логин'
                                name='login'
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                value={auth.password}
                                onChange={(e)=> setAuth({...auth, password: e.target.value})}
                                variant='outlined'
                                required
                                fullWidth
                                label='Пароль'
                                name='password'
                                type='password'
                                id='password'
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                value={auth.repeatPassword}
                                onChange={(e)=> setAuth({...auth, repeatPassword: e.target.value})}
                                variant='outlined'
                                required
                                fullWidth
                                label='Повторите пароль'
                                name='repeatPassword'
                                type='password'
                                id='repeatPassword'
                            />
                        </Grid>
                    </Grid>
                    <Button
                        type='submit'
                        fullWidth
                        variant='contained'
                        color='primary'
                        className={classes.submit}>
                        Создать аккаунт
                    </Button>
                    <Grid container justify='flex-end'>
                        <Grid item>
                            <Link to='/login'>
                                Уже есть аккаунт? Войдите
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
        </Container>
    )
}

export default RegisterPage
