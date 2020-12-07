import {
    Button,
    createStyles,
    makeStyles,
    TextField,
    Theme,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import {
    ChangeChatNameDto,
} from '../common/Dtos/Chat/ChatDtos'
import { AccountContext } from '../Contexts/AccountContext'
import { ToastContext } from '../Contexts/ToastContext'
import chatRepository from '../repository/ChatRepository'

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        changeNameBtn: {
            marginTop: theme.spacing(2),
        },
        textField:{
            display: 'block',
        },
        fieldWrapper:{
            marginRight: '20px'
        }
    })
)

type ChangeChatNameProps = {
    chatId: number
}

export const ChangeChatName: React.FC<ChangeChatNameProps> = ({ chatId }) => {
    const classes = useStyles()
    const { openToast } = useContext(ToastContext)
    const { authUser } = useContext(AccountContext)
    const [newName, setNewName] = useState<string>('')

    const handleChangeName = async () => {
        if (newName.trim().length <= 0) {
            openToast({ body: 'Имя чата не может быть пустым', type:'warning' })
            return
        }
        const changeChatNameDto: ChangeChatNameDto = {
            userId: +authUser.id,
            chatId: +chatId,
            newName,
        }

        const response = await chatRepository.changeChatName<undefined>(
            changeChatNameDto
        )
        if (response && response.isValid) {
            openToast({ body: 'Вы успешно поменяли имя чата', type:'success' })
        } else if (response && !response.isValid) {
            openToast({ body: 'Не удалось поменять имя чата', type:'error' })
        }
        setNewName('')
    }

    return (
        <div className={classes.fieldWrapper}>
            <TextField
                label='Новое название'
                variant='outlined'
                required
                className={classes.textField}
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
            />
            <Button
                variant='contained'
                color='primary'
                onClick={handleChangeName}
                className={classes.changeNameBtn}>
                Изменить
            </Button>
        </div>
    )
}
