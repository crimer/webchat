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
    iconBack: {},
    paper: {
        padding: theme.spacing(3, 2),
    },
    userName: {
        marginTop: '20px',
        fontSize: '20px',
        textAlign: 'center',
    },

    mainContent: {
        marginTop: '20px',
    },
}))

const ChatDetailPage = () => {
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

    const submitChangeProfile = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submitChangeProfile form')
    }

    return (
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
                        Чат: Такой-то
                    </Typography>
                </Grid>
                <Grid container spacing={2} className={classes.mainContent}>
                    <Paper className={classes.paper}>
                        <Grid item className={classes.gridItem}>
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

                            <p className={classes.userName}>{userData.name}</p>
                        </Grid>
                        <Grid item className={classes.gridItem}>
                            <form noValidate onSubmit={submitChangeProfile}>
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

                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'>
                                    Сохранить
                                </Button>
                            </form>
                        </Grid>
                    </Paper>
                </Grid>
            </Container>
        </div>
    )
}

export default ChatDetailPage
