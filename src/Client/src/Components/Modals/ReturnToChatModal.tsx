import {
    Avatar,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Divider,
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
import { ChatType, UserChatDto } from '../../common/Dtos/Chat/ChatDtos'
import chatRepository from '../../repository/ChatRepository'
import { ToastContext } from '../../Contexts/ToastContext'

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

type CreateChatType = {
    id: number
    type: ChatType
    text: string
}

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
    const { openToast } = useContext(ToastContext)
    const [chats, setChats] = useState<UserChatDto[] | null>()

    // const chatShortName = (chatName: string) =>
    //     chatName.trim().length !== 0 ? chatName.trim()[0].toUpperCase() : ''

    const closeModal = () => onModalClose()

    // useEffect(() => {
    //     const fetchCHatsToReturn = async () => {
    //         const response = await chatRepository.getChatsToReturnByUserId<UserChatDto[]>(authUser.id)
    //         if (response && response.isValid) {
    //             setChats(response.data)
    //         } else if (response) {
    //             openToast({ body: 'Что-то пошло не так' })
    //         }
    //     }
    //     fetchCHatsToReturn()
    // })

    const returnToChat = async (chatId: number) => {
        console.log(chatId)

        // if (chatTitle.trim().length === 0 || authUser.id <= 0) return

        // const chatDto: CreateChatDto = {
        //     chatName: chatTitle,
        //     chatTypeId: +selectedType as number,
        //     userCreatorId: authUser.id,
        // }
        // const response = await chatRepository.createNewChat<undefined>(chatDto)
        // if (response && response.isValid && response.successMessage) {
        //     openToast({ body: response.successMessage })
        // } else if (response) {
        //     openToast({ body: response.errorMessage })
        // }
        closeModal()
    }

    const chatTypes: CreateChatType[] = [
        {
            id: 1,
            type: ChatType.Group,
            text: 'Группа',
        },
        {
            id: 2,
            type: ChatType.Channel,
            text: 'Канал',
        },
    ]
    return (
        <Dialog open={open} onClose={closeModal}>
            <DialogTitle>Выберите чат в который хотите вернуться</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center' direction='column'>
                    <Grid item className={classes.gridItem}>
                        <Paper className={classes.paper}>
                            {chats && chats.length > 0 ? (
                                <List className={classes.root}>
                                    {chats?.map((chat: UserChatDto) => (
                                        <>
                                        <ListItem>
                                            <ListItemAvatar>
                                                {/* <Avatar>
                                                    {chatShortName(
                                                        chat.name
                                                    )}
                                                </Avatar> */}
                                            </ListItemAvatar>
                                            <ListItemText
                                                primary={chat.name}
                                                secondary={chat.chatType}
                                            />
                                            <Button
                                                color='primary'
                                                onClick={() =>
                                                    returnToChat(chat.id)
                                                }
                                                variant='contained'>
                                                Вернуться
                                            </Button>
                                        </ListItem>
                                        <Divider
                                            variant='inset'
                                            component='li'
                                        />
                                    </>
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
