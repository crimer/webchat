import React, { useEffect, useState } from 'react'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { useDebounce } from '../common/hooks/useDebounce'
import { UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import usersRepository from '../repository/UsersRepository'
import { CircularProgress } from '@material-ui/core'

const InviteMemberAutocomplete = () => {
    const [users, setUsers] = useState<UserChatDto[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [seatchQuery, setSearchQuery] = useState<string>('')

    const [open, setOpen] = React.useState(false)

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

    return (
        <Autocomplete
            options={users}
            open={open}
            onOpen={() => {
                setOpen(true)
            }}
            onClose={() => {
                setOpen(false)
            }}
            onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue)
            }}
            loading={loading}
            getOptionSelected={(user, value) => user.name ===  value.name}
            getOptionLabel={(user) => user.name}
            style={{ width: 300 }}
            loadingText='Загружается'
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
    )
}
export default InviteMemberAutocomplete
