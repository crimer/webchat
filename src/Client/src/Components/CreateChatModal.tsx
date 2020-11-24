import {
    Avatar,
    Button,
    createStyles,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    Grid,
    Input,
    InputLabel,
    makeStyles,
    MenuItem,
    Paper,
    Select,
    TextField,
    Theme,
    useTheme,
} from '@material-ui/core'
import React, { FormEvent, useContext, useMemo, useState } from 'react'
import Chip from '@material-ui/core/Chip'
import { ChatType } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { CreateChatDto } from '../common/Dtos/Chat/ChatDtos'
import chatRepository from '../repository/ChatRepository'
import { ToastContext } from '../Contexts/ToastContext'

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

// function getStyles(name: string, personName: string[], theme: Theme) {
//     return {
//         fontWeight:
//             personName.indexOf(name) === -1
//                 ? theme.typography.fontWeightRegular
//                 : theme.typography.fontWeightMedium,
//     }
// }

// const ITEM_HEIGHT = 48
// const ITEM_PADDING_TOP = 8
// const MenuProps = {
//     PaperProps: {
//         style: {
//             maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
//             width: 250,
//         },
//     },
// }

export type CreateChatType = {
    id: number
    type: ChatType
    text: string
    icon: any
}

type CreateChatModalProps = {
    open: boolean
    createChatType: { type: ChatType; text: string } | undefined
    onModalClose: () => void
}

const CreateChatModal: React.FC<CreateChatModalProps> = ({
    open,
    createChatType,
    onModalClose,
}) => {
    const theme = useTheme()
    const classes = useStyles()
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)

    const [chatTitle, setChatTitle] = useState('')

    const names = [
        'Oliver Hansen',
        'Van Henry',
        'April Tucker',
        'Ralph Hubbard',
        'Omar Alexander',
        'Carlos Abbott',
        'Miriam Wagner',
        'Bradley Wilkerson',
        'Virginia Andrews',
        'Kelly Snyder',
    ]

    const chatNames = chatTitle.split('')

    const chatShortName = useMemo(() => {
        const name = chatNames.reduce(
            (result, currentName) => (result += currentName[0].toUpperCase()),
            ''
        )
        return name.trim().slice(0, 1)
    }, [chatTitle])

    // const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    //     const users = event.target.value as string[]
    //     setChatSetting({ ...chatSettings, users })
    // }

    const closeModal = () => {
        setChatTitle('')
        onModalClose()
    }

    const submitChatCreation = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (chatTitle.trim().length === 0 || authUser.id <= 0 || createChatType === undefined)
            return

        const chatDto: CreateChatDto = {
            chatName: chatTitle,
            chatTypeId: createChatType?.type as number,
            userCreatorId: authUser.id
        }
        const response = await chatRepository.createNewChat<undefined>(chatDto)
        if (response && response.isValid && response.successMessage) {
            openToast({ body: response.successMessage })
        }else if(response){
            openToast({ body: response.errorMessage })
        }


        closeModal()
    }
    return (
        <Dialog open={open} onClose={closeModal}>
            <DialogTitle>Создаем новый чат</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center' direction='column'>
                    <Grid item className={classes.gridItem}>
                        <Paper className={classes.paper}>
                            <Grid container spacing={2} justify='flex-start' alignItems="flex-start" direction='row'>
                                <Grid item>
                                    <Avatar
                                        alt={chatTitle}
                                        className={classes.avatarSize}>
                                        {chatShortName}
                                    </Avatar>

                                </Grid>
                                <Grid item>

                                    <div className={classes.chatType}>
                                        <p>Тип: {createChatType && createChatType.text}</p>
                                    </div>
                                    <div className={classes.chatType}>
                                        <p>Создатель: {authUser.login}</p>
                                    </div>
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
                                onChange={(e) =>
                                    setChatTitle(e.target.value)
                                }
                                label='Название чата'
                                name='chatTitle'
                            />
                            {/* <FormControl fullWidth>
                                <InputLabel>Участники</InputLabel>
                                <Select
                                    multiple
                                    value={chatSettings.users}
                                    onChange={handleChange}
                                    input={<Input />}
                                    renderValue={(selected) => (
                                        <div className={classes.chips}>
                                            {(selected as string[]).map(
                                                (value) => (
                                                    <Chip
                                                        key={value}
                                                        label={value}
                                                        className={classes.chip}
                                                    />
                                                )
                                            )}
                                        </div>
                                    )}
                                    MenuProps={MenuProps}>
                                    {names.map((name) => (
                                        <MenuItem
                                            key={name}
                                            value={name}
                                            style={getStyles(
                                                name,
                                                chatSettings.users,
                                                theme
                                            )}>
                                            {name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl> */}
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
export default CreateChatModal
