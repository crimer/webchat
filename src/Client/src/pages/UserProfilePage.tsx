import {
    Container,
    Typography,
    Grid,
    makeStyles,
    Paper,
    Avatar,
    TextField,
    IconButton,
    Button,
    CircularProgress,
} from '@material-ui/core'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import usersRepository from '../repository/UsersRepository'
import { ChangeUserPasswordDto, UserProfileDto } from '../common/Dtos/User/UserDtos'
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
    loader:{
        margin: theme.spacing(1)
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
const defaultPassData = {
    login: '',
    oldPassword: '',
    newPassword: '',
    repeatNewPassword: '',
}

export const UserFrofilePage = () => {
    const classes = useStyles()
    const history = useHistory()
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)
    const [userData, setUserData] = useState<UserProfileDto>()
    const [isChangePassword, setIsChangePassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [changePass, setChangePass] = useState(defaultPassData)

    const submitChangePassword = async (e: FormEvent<HTMLFormElement>) => {
        try {
            e.preventDefault()
            setIsLoading(true)
            if (changePass.login.trim().length === 0 || changePass.oldPassword.trim().length === 0 ||
                changePass.newPassword.trim().length === 0 || changePass.repeatNewPassword.trim().length === 0) {
                setChangePass(defaultPassData)
                openToast({ body:'Все поля должны быть заполнены', type:'warning' })
                return
            }
            if(changePass.newPassword !== changePass.repeatNewPassword) {
                openToast({ body:'Пароли должны совпадать', type:'warning' })
                setChangePass({...changePass, newPassword: '', repeatNewPassword: ''})
                return
            }
            if(changePass.oldPassword === changePass.newPassword) {
                openToast({ body:'Новый и старый пароли должны отличаться', type:'warning' })
                setChangePass({...changePass, newPassword: '', repeatNewPassword: '', oldPassword: ''})
                return
            }

            const changeUserPasswordDto: ChangeUserPasswordDto = {
                userLogin: changePass.login,
                userOldPassword: changePass.oldPassword,
                userNewPassword: changePass.newPassword
            }
            const resp = await usersRepository.changeUserPassword<undefined>(changeUserPasswordDto)
            if (resp && resp.isValid) {
                openToast({ body:'Вы успешно изменили пароль', type:'success' })
                setChangePass(defaultPassData)
            } else if(resp && resp.responseCode === 400) {
                openToast({ body: resp.errorMessage || 'Извините, не удалось изменить пароль', type:'error' })
            }
        } catch(e){
            openToast({ body: e, type:'error' })
        } finally {
            setIsLoading(false)
        }

    }

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
                                    {isLoading ? (
                                        <CircularProgress className={classes.loader}/>
                                    ) : (
                                        <Avatar
                                            alt={userData.login}
                                            className={classes.avatarSize}>
                                            {userData.login[0]}
                                        </Avatar>
                                    )}

                                        <p className={classes.userName}>
                                            {userData.login}
                                        </p>
                                    </Paper>
                                </Grid>

                                <Grid item className={classes.gridItem}>
                                    <Paper className={classes.paper}>
                                        <p>{JSON.stringify(changePass)}</p>
                                        <form
                                            noValidate
                                            onSubmit={submitChangePassword}>
                                            <TextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                fullWidth
                                                id='login'
                                                disabled={isLoading}
                                                label='Логин'
                                                name='login'
                                                value={changePass.login}
                                                onChange={(e) =>
                                                    setChangePass({
                                                        ...changePass,
                                                        login: e.target.value,
                                                    })
                                                }
                                            />
                                            <TextField
                                                variant='outlined'
                                                margin='normal'
                                                required
                                                disabled={!isChangePassword || isLoading}
                                                fullWidth
                                                name='password'
                                                label='Ваш пароль'
                                                type='password'
                                                id='password'
                                                value={changePass.oldPassword}
                                                onChange={(e) =>
                                                    setChangePass({
                                                        ...changePass,
                                                        oldPassword: e.target.value,
                                                    })
                                                }
                                            />
                                            {isChangePassword && (
                                                <div>
                                                    <TextField
                                                        variant='outlined'
                                                        margin='normal'
                                                        fullWidth
                                                        name='newPassword'
                                                        disabled={isLoading}
                                                        label='Новый пароль'
                                                        type='password'
                                                        id='newPassword'
                                                        value={changePass.newPassword}
                                                        onChange={(e) =>
                                                            setChangePass({
                                                                ...changePass,
                                                                newPassword: e.target.value,
                                                            })
                                                        }
                                                    />
                                                    <TextField
                                                        variant='outlined'
                                                        margin='normal'
                                                        fullWidth
                                                        name='repeatNewPassword'
                                                        disabled={isLoading}
                                                        label='Повторите новый пароль'
                                                        type='password'
                                                        id='repeatNewPassword'
                                                        value={changePass.repeatNewPassword}
                                                        onChange={(e) =>
                                                            setChangePass({
                                                                ...changePass,
                                                                repeatNewPassword: e.target.value,
                                                            })
                                                        }
                                                    />
                                                </div>
                                            )}

                                            <Button
                                                type='submit'
                                                variant='contained'
                                                color='primary'
                                                disabled={isLoading}>
                                                Сохранить
                                            </Button>
                                            <Button
                                                onClick={() => {
                                                    setIsChangePassword(
                                                        !isChangePassword
                                                    )
                                                }}
                                                className={
                                                    classes.changePassBtn
                                                }
                                                variant='contained'>
                                                Изминить пароль
                                            </Button>
                                        </form>
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
