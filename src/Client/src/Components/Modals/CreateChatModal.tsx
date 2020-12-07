import {
    Avatar,
    Button,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    TextField,
    Theme,
} from '@material-ui/core'
import React, { FormEvent, useContext, useMemo, useState } from 'react'
import { AccountContext } from '../../Contexts/AccountContext'
import { ChatType, CreateChatDto } from '../../common/Dtos/Chat/ChatDtos'
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

type CreateChatModalProps = {
    open: boolean
    onModalClose: () => void
}

export const CreateChatModal: React.FC<CreateChatModalProps> = ({
    open,
    onModalClose,
}) => {
    const classes = useStyles()
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)
    const { getChatsByUserId } = useContext(ChatContext)

    const [chatTitle, setChatTitle] = useState<string>('')
    const [selectedType, setSelectedType] = useState<number>(1)

    const chatShortName = useMemo(() => chatTitle.trim().length !== 0 ? chatTitle.trim()[0].toUpperCase() : '', [chatTitle])

    const closeModal = () => {
        setChatTitle('')
        onModalClose()
    }

    const submitChatCreation = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (chatTitle.trim().length === 0 || authUser.id <= 0) return

        const chatDto: CreateChatDto = {
            chatName: chatTitle,
            chatTypeId: +selectedType as number,
            userCreatorId: authUser.id,
        }
        const response = await chatRepository.createNewChat<undefined>(chatDto)
        if (response && response.isValid) {
            openToast({ body: 'Чат успешно создан', type:'success' })
            getChatsByUserId(authUser.id)
        } else if (response) {
            openToast({ body: 'Не удалось создать чат', type:'error' })
        }
        closeModal()
    }

    const changeChatType = (event: React.ChangeEvent<{ value: unknown }>) => setSelectedType(event.target.value as number)

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
            <DialogTitle>Создаем новый чат</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center' direction='column'>
                    <Grid item className={classes.gridItem}>
                        <Paper className={classes.paper}>
                            <Grid
                                container
                                spacing={2}
                                justify='flex-start'
                                alignItems='flex-start'
                                direction='row'>
                                <Grid item>
                                    <Avatar
                                        alt={chatTitle}
                                        className={classes.avatarSize}>
                                        {chatShortName}
                                    </Avatar>
                                </Grid>
                                <Grid item>
                                    <div className={classes.chatType}>
                                        <p>Создатель: {authUser.login}</p>
                                    </div>
                                    <FormControl
                                        className={classes.formControl}>
                                        <InputLabel id='chat-type-select-label'>
                                            Тип чата
                                        </InputLabel>
                                        <Select
                                            labelId='chat-type-select-label'
                                            value={selectedType}
                                            onChange={changeChatType}>
                                            {chatTypes.map((chat) => (
                                                <MenuItem
                                                    key={chat.id}
                                                    value={chat.type}>
                                                    {chat.text}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.gridItem}>
                        <form onSubmit={submitChatCreation}>
                            <TextField
                                variant='outlined'
                                autoFocus
                                margin='normal'
                                required
                                fullWidth
                                value={chatTitle}
                                onChange={(e) => setChatTitle(e.target.value)}
                                label='Название чата'
                                name='chatTitle'
                            />

                            <Button type='submit' color='primary'>
                                Создать
                            </Button>
                            <Button onClick={closeModal} color='primary'>
                                Отмена
                            </Button>
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
