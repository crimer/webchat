import React from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import IconButton from '@material-ui/core/IconButton'
import {
    Avatar,
    Divider,
    ListItemAvatar,
    ListSubheader,
} from '@material-ui/core'
import SupervisedUserCircleIcon from '@material-ui/icons/SupervisedUserCircle'
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
    })
)

type ChatMembersProps = {
    members: UserChatDto[]
}
const ChatMembers: React.FC<ChatMembersProps> = ({ members }) => {
    const classes = useStyles()

    return (
        <List
            className={classes.root}
            dense
            subheader={
                <ListSubheader component='div'>
                    Участники чата ({members.length})
                </ListSubheader>
            }>
            {members.map((member) => {
                return (
                    <ListItem key={member.id} role={undefined} dense>
                        <ListItemAvatar>
                            <Avatar>{member.name[0].toUpperCase()}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            className={classes.listText}
                            primary={member.name}
                            secondary={UserRole[member.userRoleId]}
                        />

                        <ListItemSecondaryAction>
                            <IconButton edge='end'>
                                <SupervisedUserCircleIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )
            })}
        </List>
    )
}

export default ChatMembers
