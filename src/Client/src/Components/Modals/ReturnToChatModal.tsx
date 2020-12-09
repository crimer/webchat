import {
    Avatar,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    makeStyles,
    Paper,
    Theme,
} from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import { AccountContext } from '../../Contexts/AccountContext'
import { ChatDto, ReturnToChatDto } from '../../common/Dtos/Chat/ChatDtos'
import chatRepository from '../../repository/ChatRepository'
import { ToastContext } from '../../Contexts/ToastContext'
import { ChatContext } from '../../Contexts/ChatContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
            maxWidth: 300,
        },
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
        chips: {
            display: 'flex',
            flexWrap: 'wrap',
        },
        chip: {
            margin: 2,
        },
        noLabel: {
            marginTop: theme.spacing(3),
        },
        avatarSize: {
            width: theme.spacing(15),
            height: theme.spacing(15),
            fontSize: '45px',
        },
        gridItem: {
            minWidth: '500px',
        },
        paper: {
            padding: theme.spacing(3, 2),
        },
        chatType: {
            '& p': {
                marginTop: '0px',
                marginBottom: '10px',
                marginRight: '10px',
            },
        },
    })
)


type ReturnToChatModalProps = {
    open: boolean
    onModalClose: () => void
}

export const ReturnToChatModal: React.FC<ReturnToChatModalProps> = ({
    open,
    onModalClose,
}) => {
    const classes = useStyles()
    const { authUser } = useContext(AccountContext)
    const { getChatsByUserId } = useContext(ChatContext)
    const { openToast } = useContext(ToastContext)
    const [chats, setChats] = useState<ChatDto[] | null>()

    const chatShortName = (chatName: string) => chatName.trim().length !== 0 ? chatName.trim()[0].toUpperCase() : ''

    const closeModal = () => onModalClose()

    useEffect(() => {
        const fetchChatsToReturn = async () => {
            const response = await chatRepository.getChatsToReturnByUserId<ChatDto[]>(authUser.id)
            if (response && response.isValid) {
                setChats(response.data)
            } else if (response) {
                openToast({ body: 'Что-то пошло не так', type:'error' })
            }
        }
        if(open === true)
            fetchChatsToReturn()

    }, [open])

    const returnToChat = async (chatId: number) => {

        if (chatId <= 0) return

        const returnToChatDto: ReturnToChatDto = {
            chatId: +chatId,
            userId: +authUser.id,
        }

        const response = await chatRepository.returnToChat<undefined>(returnToChatDto)
        if (response && response.isValid) {
            await getChatsByUserId(authUser.id)
            openToast({ body: 'Вы вернулись в чат', type:'success' })
        } else if (response && response.responseCode === 400) {
            openToast({ body: "Вы или уже в чате или вас в нем заблокировали", type:'error' })
        }
        closeModal()
    }

    return (
        <Dialog open={open} onClose={closeModal}>
            <DialogTitle>Выберите чат в который хотите вернуться</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center' direction='column'>
                    <Grid item className={classes.gridItem}>
                        <Paper className={classes.paper}>
                            {chats && chats.length > 0 ? (
                                <List className={classes.root}>
                                    {chats?.map((chat: ChatDto) => (
                                        <ListItem key={chat.id}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    {chatShortName(chat.name)}
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={chat.name}/>
                                            <Button
                                                color='primary'
                                                onClick={() =>
                                                    returnToChat(chat.id)
                                                }
                                                variant='contained'>
                                                Вернуться
                                            </Button>
                                        </ListItem>
                                    ))}
                                </List>
                            ) : (
                                <p>Чатов нет</p>

                            )}
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
