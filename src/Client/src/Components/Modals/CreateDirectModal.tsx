import {
    Avatar,
    Button,
    CircularProgress,
    createStyles,
    Dialog,
    DialogContent,
    DialogTitle,
    Grid,
    makeStyles,
    Paper,
    TextField,
    Theme,
} from '@material-ui/core'
import React, {
    FormEvent,
    useContext,
    useEffect,
    useState,
} from 'react'
import { AccountContext } from '../../Contexts/AccountContext'
import {
    CreateDirectChatDto,
    DirectChatDto,
    UserChatDto,
} from '../../common/Dtos/Chat/ChatDtos'
import chatRepository from '../../repository/ChatRepository'
import { ToastContext } from '../../Contexts/ToastContext'
import { ChatContext } from '../../Contexts/ChatContext'
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet'
import { useDebounce } from '../../common/hooks/useDebounce'
import usersRepository from '../../repository/UsersRepository'
import { Autocomplete } from '@material-ui/lab'
import { useHistory } from 'react-router-dom'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        modalRoot: {
            minWidth: '500px',
        },
        avatarSize: {
            width: theme.spacing(8),
            height: theme.spacing(8),
            fontSize: '38px',
        },
        avatarName: {
            fontSize: '25px',
            margin: 0,
            textAlign: 'center',
        },
        paper: {
            padding: theme.spacing(3, 2),
        },
        selectUserForm: {
            marginTop: '20px',
            display: 'flex',
            flexFlow: 'column nowrap',
            alignItems: 'flex-start',
        },
        arrowIcon: {
            fontSize: '48px',
        },
        formButton: {
            marginTop: '20px',
        },
    })
)

type CreateDirectModalProps = {
    open: boolean
    onModalClose: () => void
}

export const CreateDirectModal: React.FC<CreateDirectModalProps> = ({
    open,
    onModalClose,
}) => {
    const classes = useStyles()
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)
    const { getChatsByUserId } = useContext(ChatContext)

    const [users, setUsers] = useState<UserChatDto[]>([])
    const [selectedUser, setSelectedUser] = useState<UserChatDto | null>(null)
    const history = useHistory()
    const [loading, setLoading] = useState<boolean>(false)
    const [seatchQuery, setSearchQuery] = useState<string>('')

    const debouncedSearchQuery = useDebounce(seatchQuery, 500)

    useEffect(() => {
        const fetchUsers = async () => {
            if (debouncedSearchQuery.trim().length <= 0) return
            setLoading(true)
            const response = await usersRepository.searchUsersByLogin<UserChatDto[]>(debouncedSearchQuery)

            if (response && response.isValid) {
                setUsers(response.data)
            }
            setLoading(false)
        }
        fetchUsers()
    }, [debouncedSearchQuery])

    const closeModal = () => {
        onModalClose()
    }

    const submitDirectCreation = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if(selectedUser === null){
            openToast({body: 'Вы не выбрали собеседника', type:'warning'})
            return
        }
        if(authUser.id === selectedUser?.id){
            openToast({body: 'Нельзя создать чат с самим собой', type:'warning'})
            return
        }

        const directDto: CreateDirectChatDto = {
            userId: +authUser.id,
            memberId: +selectedUser.id
        }

        const response = await chatRepository.createDirectChat<DirectChatDto>(directDto)
        if (response && response.isValid) {
            openToast({ body: 'Чат успешно создан', type:'success' })
            await getChatsByUserId(authUser.id)
            history.push(`/chat/${response.data.chatId}`)
        } else if (response ) {
            openToast({ body: `Не удалось создать чат. ${response.errorMessage}`, type:'error' })
        }
        closeModal()
    }

    return (
        <Dialog open={open} onClose={closeModal} className={classes.modalRoot}>
            <DialogTitle>Создаем личную переписку</DialogTitle>
            <DialogContent>
                <Grid container spacing={2} justify='center' direction='column'>
                    <Grid item>
                        <Paper className={classes.paper}>
                            <Grid
                                container
                                spacing={2}
                                justify='space-between'
                                alignItems='center'
                                direction='row'>
                                <Grid item>
                                    <Avatar
                                        alt={authUser.login}
                                        className={classes.avatarSize}>
                                        {authUser.login[0]}
                                    </Avatar>
                                    <p className={classes.avatarName}>
                                        {authUser.login}
                                    </p>
                                </Grid>
                                <SettingsEthernetIcon
                                    className={classes.arrowIcon}
                                />
                                <Grid item>
                                    <Avatar
                                        alt={selectedUser?.name}
                                        className={classes.avatarSize}>
                                        {selectedUser
                                            ? selectedUser.name[0]
                                            : '?'}
                                    </Avatar>
                                    <p className={classes.avatarName}>
                                        {selectedUser ? selectedUser.name : '?'}
                                    </p>
                                </Grid>
                            </Grid>
                            <p>Тип чата: Личная переписка</p>
                            <form
                                className={classes.selectUserForm}
                                onSubmit={submitDirectCreation}>
                                <Autocomplete
                                    options={users}
                                    getOptionLabel={(user) => user.name}
                                    onChange={(event, user) =>
                                        setSelectedUser(user)
                                    }
                                    filterSelectedOptions={true}
                                    style={{ width: '300px' }}
                                    loadingText='Загружается'
                                    onInputChange={(event, newInputValue) => {
                                        setSearchQuery(newInputValue)
                                    }}
                                    loading={loading}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            label='Выбрать пользователя'
                                            variant='outlined'
                                            InputProps={{
                                                ...params.InputProps,
                                                endAdornment: (
                                                    <>
                                                        {loading ? (
                                                            <CircularProgress
                                                                color='inherit'
                                                                size={20}
                                                            />
                                                        ) : null}
                                                        {
                                                            params.InputProps
                                                                .endAdornment
                                                        }
                                                    </>
                                                ),
                                            }}
                                        />
                                    )}
                                />
                                <Button
                                    color='primary'
                                    variant='contained'
                                    type='submit'
                                    className={classes.formButton}>
                                    Начать переписку
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
