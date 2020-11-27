import {
    Container,
    Typography,
    Grid,
    makeStyles,
    Paper,
    Avatar,
    IconButton,
} from '@material-ui/core'
import React, { FormEvent, useContext, useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import KeyboardBackspaceIcon from '@material-ui/icons/KeyboardBackspace'
import ChatMembers from '../Components/ChatMembers'
import InviteMemberAutocomplete from '../Components/InviteMemberAutocomplete'
import chatRepository from '../repository/ChatRepository'
import { ChatDetailDto } from '../common/Dtos/Chat/ChatDtos'
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
    const [detailInfo, setDetailInfo] = useState<ChatDetailDto>()
    const { chatId } = useParams()
    const classes = useStyles()
    const history = useHistory()
    const { openToast } = useContext(ToastContext)

    const submitChangeProfile = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log('submitChangeProfile form')
    }
    useEffect(() => {
        const fetchDetailInfo = async () => {
            const response = await chatRepository.getDetailChatInfo<ChatDetailDto>(
                chatId
            )
            if (response && response.isValid) {
                setDetailInfo(response.data)
            } else if (response) {
                openToast({ body: response.errorMessage })
            }
        }
        fetchDetailInfo()
    }, [])

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
                        Чат: {detailInfo ? detailInfo.name : ':('}
                    </Typography>
                </Grid>
                <Paper className={classes.paper}>
                    {!detailInfo ? (
                        <Typography
                            component='h1'
                            variant='h4'
                            align='left'
                            color='textPrimary'>
                            Не удалось загрузить детальную информацию
                        </Typography>
                    ) : (
                        <Grid
                            container
                            direction='row'
                            spacing={2}
                            className={classes.mainContent}>
                            <Grid item className={classes.gridItem}>
                                <Grid
                                    container
                                    alignItems='center'
                                    direction='column'>
                                    <Avatar
                                        alt={detailInfo.name}
                                        className={classes.avatarSize}>
                                        {detailInfo.name[0].toUpperCase()}
                                    </Avatar>
                                    <p className={classes.userName}>
                                        {detailInfo.name}
                                    </p>
                                </Grid>
                            </Grid>
                            <Grid item className={classes.gridItem}>
                                <ChatMembers members={detailInfo.members} />
                            </Grid>
                            <Grid item className={classes.gridItem}>
                                <InviteMemberAutocomplete chatId={chatId}/>
                            </Grid>
                        </Grid>
                    )}
                </Paper>
            </Container>
        </div>
    )
}

export default ChatDetailPage
