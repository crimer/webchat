import React from 'react'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Link } from 'react-router-dom'
import Grid from '@material-ui/core/Grid'
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import Typography from '@material-ui/core/Typography'
import { makeStyles } from '@material-ui/core/styles'
import Container from '@material-ui/core/Container'

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

    return (
        <Container component='main' maxWidth='xs'>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component='h1' variant='h5'>
                    Регистрация
                </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                variant='outlined'
                                required
                                fullWidth
                                id='name'
                                label='Имя'
                                name='name'
                                autoComplete='name'
                                autoFocus
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
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
                                variant='outlined'
                                required
                                fullWidth
                                label='Повторите пароль'
                                name='repeat-password'
                                type='password'
                                id='repeat-password'
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
