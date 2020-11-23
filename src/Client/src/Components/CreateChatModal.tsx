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
import React, { useMemo, useState } from 'react'
import Chip from '@material-ui/core/Chip'
import { ChatType } from '../Contexts/ChatContext'

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
            marginTop: '20px',
            display: 'flex',
            alignItems: 'center',
            '& p': {
                marginRight: '10px',
            },
        },
    })
)

function getStyles(name: string, personName: string[], theme: Theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    }
}

const ITEM_HEIGHT = 48
const ITEM_PADDING_TOP = 8
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
}

export type CreateChatType = {
    id: number
    type: ChatType
    text: string
    icon: any
}

type CreateChatModalType = {
    open: boolean
    createChatType: CreateChatType | undefined
    onModalClose: () => void
}

const CreateChatModal: React.FC<CreateChatModalType> = ({
    open,
    createChatType,
    onModalClose,
}) => {
    const theme = useTheme()
    const classes = useStyles()

    const [chatSettings, setChatSetting] = useState<{
        chatTitle: string
        chatType: string
        users: string[]
        creator: string
    }>({
        chatTitle: '',
        chatType: '',
        users: [],
        creator: '',
    })
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

    const chatNames = chatSettings.chatTitle.split('')

    const chatShortName = useMemo(() => {
        const name = chatNames.reduce(
            (result, currentName) => (result += currentName[0].toUpperCase()),
            ''
        )
        return name.trim().slice(0, 1)
    }, [chatSettings.chatTitle])

    const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const users = event.target.value as string[]
        setChatSetting({ ...chatSettings, users })
    }
    const closeModal = () => {
        setChatSetting({
            chatTitle: '',
            chatType: '',
            users: [],
            creator: '',
        })
        onModalClose()
    }

    return (
        <Dialog open={open} onClose={closeModal}>
            <DialogTitle>Создаем новый чат</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center'>
                    <Grid item className={classes.gridItem}>
                        <Paper className={classes.paper}>
                            <Avatar
                                alt={chatSettings.chatTitle}
                                className={classes.avatarSize}>
                                {chatShortName}
                            </Avatar>
                            <div className={classes.chatType}>
                                <p>Тип:</p>
                                {createChatType && createChatType.icon}
                                {createChatType && createChatType.text}
                            </div>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.gridItem}>
                        <form>
                            <TextField
                                variant='outlined'
                                margin='normal'
                                required
                                fullWidth
                                value={chatSettings.chatTitle}
                                onChange={(e) =>
                                    setChatSetting({
                                        ...chatSettings,
                                        chatTitle: e.target.value,
                                    })
                                }
                                label='Название чата'
                                name='chatTitle'
                                autoFocus
                            />
                            <FormControl fullWidth>
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
                            </FormControl>
                        </form>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeModal} color='primary' autoFocus>
                    Создать
                </Button>
                <Button onClick={closeModal} color='primary'>
                    Отмена
                </Button>
            </DialogActions>
        </Dialog>
    )
}
export default CreateChatModal
