import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import DeleteIcon from '@material-ui/icons/Delete'
import {
    Avatar,
    Button,
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
        deleteIcon:{
            color: '#f50057'
        }
    })
)

type ChatMembersProps = {
    members: UserChatDto[]
}
const ChatMembers: React.FC<ChatMembersProps> = ({ members }) => {
    const classes = useStyles()

    return (
        <div className={classes.wrapper}>
            <p>Участники чата ({members.length})</p>
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label='simple table'>
                    <TableHead>
                        <TableRow>
                            <TableCell align='left'>Имя</TableCell>
                            <TableCell align='left'>Роль</TableCell>
                            <TableCell align='left'>Действие</TableCell>
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
                                <TableCell align='left'>
                                    <IconButton>
                                        <DeleteIcon className={classes.deleteIcon}/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
        // <List
        //     className={classes.root}
        //     dense
        //     subheader={
        //         <ListSubheader component='div'>
        //             Участники чата ({members.length})
        //         </ListSubheader>
        //     }>
        //     {members.map((member) => {
        //         return (
        //             <ListItem key={member.id} role={undefined} dense>
        //                 <ListItemAvatar>
        //                     <Avatar>{member.name[0].toUpperCase()}</Avatar>
        //                 </ListItemAvatar>
        //                 <ListItemText
        //                     className={classes.listText}
        //                     primary={member.name}
        //                     secondary={UserRole[member.userRoleId]}
        //                 />

        //                 <ListItemSecondaryAction>
        //                     <IconButton edge='end'>
        //                         <SupervisedUserCircleIcon />
        //                     </IconButton>
        //                 </ListItemSecondaryAction>
        //             </ListItem>
        //         )
        //     })}
        // </List>
    )
}

export default ChatMembers
