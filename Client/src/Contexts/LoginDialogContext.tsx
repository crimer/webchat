import React, { useContext, useRef, createContext, useState } from 'react'
import { TextField, Button } from '@material-ui/core'
import '../styles/LoginDialog.css'
import { AccountContext } from './AccountContext'
import SignalRManager from '../SignalR/SignalRManager'
import { ModalContext } from './ModalContext'

interface ILoginDialogContext {
    setIsDialogOpen: (dialogOpen: boolean) => void
}

export const LoginDialogContext = createContext<ILoginDialogContext>({
    setIsDialogOpen: (dialogOpen: boolean) => {
        throw new Error('Не проинициализирован контект диалога')
    },
})

export const LogingDialogContextProvder: React.FC = ({ children }) => {
    const [userLogin, setUserLogin] = useState<string>('')

    const { login } = useContext(AccountContext)
    const { openModal } = useContext(ModalContext)

    const dialogRef = useRef<HTMLDialogElement>(null)

    const setIsDialogOpen = (isDialogOpen: boolean) => {
        if (!dialogRef.current) return

        if (isDialogOpen) {
            dialogRef.current.showModal()
        } else {
            dialogRef.current.close()
        }
    }

    const loginInternal = async () => {
        if (!dialogRef.current) return

        dialogRef.current.close()
        if (userLogin.trim().length === 0) {
            setUserLogin('')
            openModal('Внимание!', 'Логин не должен быть пустым')
            return
        }
        const isLogin = await login(userLogin.trim())
        if (isLogin) await SignalRManager.instance.reconnect()
        setUserLogin('')
    }

    const enterPressHandler = async (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => event.key === 'Enter' && (await loginInternal())

    return (
        <LoginDialogContext.Provider value={{ setIsDialogOpen }}>
            <dialog ref={dialogRef} className='login-dialog'>
                <div className='login-dialog-header'>
                    <span className='login-dialog-header-text'>
                        Авторизация
                    </span>
                </div>
                <div className='login-dialog-body'>
                    <TextField
                        value={userLogin}
                        onChange={(e) => setUserLogin(e.target.value)}
                        onKeyPress={(event) => enterPressHandler(event)}
                        label='Имя пользователя'
                        fullWidth helperText='(не более 25 символов)'

                        inputProps={{
                            maxLength: 25,
                        }}
                    />
                </div>
                <div className='login-dialog-footer'>
                    <Button
                        onClick={() => loginInternal()}
                        className='login-dialog-send-button'
                        color='primary'>
                        Вход
                    </Button>
                    <Button
                        onClick={() => setIsDialogOpen(false)}
                        className='login-dialog-close-button'
                        color='primary'>
                        Закрыть
                    </Button>
                </div>
            </dialog>
            {children}
        </LoginDialogContext.Provider>
    )
}
