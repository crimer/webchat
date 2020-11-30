import React, { useContext, useState } from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import {
    Avatar,
    Grid,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@material-ui/core'
import { UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import { UserRole } from '../common/Dtos/User/UserDtos'
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount'
import { ChangeUserRoleModal } from './ChangeUserRoleModal'
import { useParams } from 'react-router-dom'
import { AccountContext } from '../Contexts/AccountContext'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            maxWidth: 400,
            backgroundColor: theme.palette.background.paper,
            height: '350px',
            overflowY: 'auto',
        },
        listText: {
            marginRight: '20px',
        },
        table: {
            width: '100%',
        },
        wrapper: {
            flex: '1 1 auto',
        },
        userAvatar: {
            marginRight: '10px',
        },
        deleteIcon: {
            color: '#f50057',
        },
    })
)

type ChatMembersProps = {
    members: UserChatDto[]
    currentUserRoleId: number | undefined
}
export const ChatMembers: React.FC<ChatMembersProps> = ({
    members,
    currentUserRoleId,
}) => {
    const classes = useStyles()
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [selectedMember, setSelectedMember] = useState()


    const closeModal = () => setIsOpenModal(false)
    const openModal = (member: UserChatDto) => {
        setSelectedMember(member)
        setIsOpenModal(true)
    }



    return (
        <div className={classes.wrapper}>
            <ChangeUserRoleModal
                open={isOpenModal}
                onModalClose={closeModal}
                member={selectedMember}
            />
            <p>Участники чата ({members.length})</p>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Имя</TableCell>
                            <TableCell align='left'>Роль</TableCell>
                            {currentUserRoleId === UserRole.Administrator && (
                                <TableCell align='left'>Действие</TableCell>
                            )}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {members.map((memberRow) => (
                            <TableRow key={memberRow.id}>
                                <TableCell component='th' scope='row'>
                                    <Grid
                                        container
                                        direction='row'
                                        alignItems='center'>
                                        <Avatar className={classes.userAvatar}>
                                            {memberRow.name[0].toUpperCase()}
                                        </Avatar>
                                        {memberRow.name}
                                    </Grid>
                                </TableCell>
                                <TableCell align='left'>
                                    {UserRole[memberRow.userRoleId]}
                                </TableCell>
                                {currentUserRoleId ===
                                    UserRole.Administrator && (
                                    <TableCell align='left'>
                                        <IconButton
                                            onClick={() =>
                                                openModal(memberRow)
                                            }>
                                            <SupervisorAccountIcon />
                                        </IconButton>
                                        <IconButton>
                                            <DeleteIcon
                                                className={classes.deleteIcon}
                                            />
                                        </IconButton>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}
