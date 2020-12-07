import {
    Dialog,
    DialogTitle,
    DialogContent,
    Grid,
    Paper,
    Avatar,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Button,
    createStyles,
    makeStyles,
    Theme,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { useParams } from 'react-router-dom'
import { UserChatDto } from '../../common/Dtos/Chat/ChatDtos'
import { UserRole } from '../../common/Dtos/User/UserDtos'
import { AccountContext } from '../../Contexts/AccountContext'
import { ToastContext } from '../../Contexts/ToastContext'
import { ChangeUserRoleDto } from '../../common/Dtos/Chat/ChatDtos'
import chatRepository from '../../repository/ChatRepository'

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
        userName: {
            textAlign: 'center',
            fontSize: '20px',
        },
    })
)

type ChangeUserRoleModalProps = {
    open: boolean
    member: UserChatDto | undefined
    onModalClose: () => void
}

type Role = {
    id: number
    role: string
}
const roles: Role[] = [
    {
        id: UserRole.Administrator,
        role: 'Administrator',
    },
    {
        id: UserRole.Manager,
        role: 'Manager',
    },
    {
        id: UserRole.Member,
        role: 'Member',
    },
]

export const ChangeUserRoleModal: React.FC<ChangeUserRoleModalProps> = ({
    open,
    onModalClose,
    member,
}) => {
    const classes = useStyles()
    const [selectedRole, setSelectedRole] = useState<number>()
    const { chatId } = useParams()
    const { openToast } = useContext(ToastContext)

    const memberShortName = member && member.name.trim().toUpperCase()[0]

    const changeRole = (event: React.ChangeEvent<{ value: unknown }>) =>
        setSelectedRole(event.target.value as number)

    const closeModal = () => {
        onModalClose()
        setSelectedRole(undefined)
    }

    const submitChangeRole = async (selectedRoleId: number | undefined) => {
        if (selectedRoleId === undefined || selectedRoleId <= 0) {
            openToast({ body: 'Роль не выбрана!', type:'warning' })
            return
        }
        if(member === undefined){
            openToast({ body: 'Что-то пошло не так!', type:'error' })
            return
        }
        const changeRoleDto: ChangeUserRoleDto = {
            userId: +member?.id,
            chatId: +chatId as number,
            userRoleId: +selectedRoleId,
        }

        const response = await chatRepository.changeMemberRole<undefined>(changeRoleDto)
        if (response && response.isValid) {
            openToast({ body: 'Роль успешно изменена', type:'success' })
        } else if (response) {
            openToast({ body: response.errorMessage, type:'error' })
        }
        closeModal()
    }

    return (
        <Dialog open={open} onClose={closeModal}>
            <DialogTitle>Меняем роль</DialogTitle>
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
                                        alt={memberShortName}
                                        className={classes.avatarSize}>
                                        {memberShortName}
                                    </Avatar>
                                    <p className={classes.userName}>
                                        {member && member.name}
                                    </p>
                                </Grid>
                                <Grid item>
                                    <p className={classes.userName}>
                                        Текущая роль:{' '}
                                        {member && UserRole[member.userRoleId]}
                                    </p>
                                    <FormControl
                                        className={classes.formControl}>
                                        <InputLabel id='role-change-select-label'>
                                            Новая роль
                                        </InputLabel>
                                        <Select
                                            labelId='role-change-select-label'
                                            value={selectedRole}
                                            onChange={changeRole}>
                                            {roles.map((role) => (
                                                <MenuItem
                                                    key={role.id}
                                                    value={role.id}>
                                                    {role.role}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item className={classes.gridItem}>
                        <Button
                            color='primary'
                            onClick={() => submitChangeRole(selectedRole)}>
                            Присвоить роль
                        </Button>
                        <Button onClick={closeModal} color='primary'>
                            Отмена
                        </Button>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    )
}
