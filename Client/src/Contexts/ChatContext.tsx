import React, { useState, createContext, useEffect, useContext } from 'react'
import SignalRManager from '../SignalR/SignalRManager'
import { AccountContext } from './AccountContext'
import { ModalContext } from './ModalContext'

type UserMessage = {
    userName: string
    text: string
    isMy: boolean
    time: number
}

interface IChatContext {
    messages: UserMessage[],
    clearMessages: () => void,
    sendMessage: (message: string) => Promise<void>
}

export const ChatContext = createContext<IChatContext>({
    messages: [],
    clearMessages: () => {
        throw new Error('Контекст чата не проинициализирован')
    },
    sendMessage: (message: string) => {
        throw new Error('Контекст чата не проинициализирован')
    },
})

export const ChatContextProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<UserMessage[]>([])
    const { currentUserName } = useContext(AccountContext)
    const { openModal } = useContext(ModalContext)

    useEffect(() => {
        SignalRManager.instance.connection.on(
            'NewMessage',
            (message: UserMessage) => {
                message.isMy = currentUserName === message.userName
                message.time = new Date().getTime()

                setMessages((existedMessages: UserMessage[]) => [
                    ...existedMessages,
                    message,
                ])
            }
        )
        return () => SignalRManager.instance.connection.off('NewMessage')
    }, [currentUserName])

    useEffect(()=>{
        if(currentUserName === '')
        setMessages([])
    },[currentUserName])
    
    const sendMessage = (message: string) => {
        return SignalRManager.instance
            .sendMessage('NewMessage', message)
            .catch(() =>
                openModal(
                    'Внимание!',
                    'Не удалось отправить сообщение, потеряно соединение с сервером'
                )
            )
    }
    const clearMessages = () => setMessages([])

    return (
        <ChatContext.Provider value={{ messages, sendMessage, clearMessages }}>
            {children}
        </ChatContext.Provider>
    )
}
