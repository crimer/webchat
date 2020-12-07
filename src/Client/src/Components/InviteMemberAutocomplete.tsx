import React, { useContext, useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from '../common/hooks/useDebounce'
import { InviteMembersDto, UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import usersRepository from '../repository/UsersRepository'
import {
    Button,
    CircularProgress,
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core'
import chatRepository from '../repository/ChatRepository'
import { ToastContext } from '../Contexts/ToastContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        inviteBtn: {
            marginTop: theme.spacing(2),
        },
    })
)

type InviteMemberAutocompleteProps = {
    chatId: number
}
const InviteMemberAutocomplete: React.FC<InviteMemberAutocompleteProps> = ({chatId}) => {
    const [users, setUsers] = useState<UserChatDto[]>([])
    const [selectedUsers, setSelectedUsers] = useState<UserChatDto[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const { openToast } = useContext(ToastContext)
    const [seatchQuery, setSearchQuery] = useState<string>('')
    const classes = useStyles()

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

    const handleInviteUsers = async () => {
        const userIds = selectedUsers.map(user => user.id)

        const inviteMembersDto: InviteMembersDto = {
            chatId: +chatId,
            userIds
        }

        const response = await chatRepository.inviteMembersToChat<undefined>(inviteMembersDto)
        if(response && response.isValid && response.successMessage){
            openToast({ body: response.successMessage, type:'success' })
        } else if(response && !response.isValid) {
            openToast({ body: response.errorMessage, type:'error' })
        }
    }

    return (
        <div>
            <Autocomplete
                multiple
                options={users}
                getOptionLabel={(user) => user.name}
                onChange={(event, users) => setSelectedUsers(users)}
                filterSelectedOptions={true}
                style={{ width: 300 }}
                loadingText='Загружается'
                onInputChange={(event, newInputValue) => {
                    setSearchQuery(newInputValue)
                }}
                loading={loading}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label='Пригласить участников'
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
                                    {params.InputProps.endAdornment}
                                </>
                            ),
                        }}
                    />
                )}
            />
            <Button
                variant='contained'
                color='primary'
                onClick={handleInviteUsers}
                className={classes.inviteBtn}>
                Пригласить
            </Button>
        </div>
    )
}
export default InviteMemberAutocomplete
