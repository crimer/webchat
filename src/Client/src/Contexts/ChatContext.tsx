import React, { useState, createContext, useEffect, useContext } from 'react'
import { ApiResponse } from '../common/Api/ApiHelper'
import chatRepository from '../repository/ChatRepository'
import SignalRManager from '../SignalR/SignalRManager'
import { AccountContext } from './AccountContext'
import { ModalContext } from './ModalContext'

type UserMessage = {
    id: number,
    userName: string
    text: string
    isMy: boolean
    createdAt: number
}

type SendMessageDto = {
    text: string
    userId: number
    chatId: number
    mediaId: number | null
    replyId: number | null
}
interface IChatContext {
    messages: UserMessage[]
    sendMessage: (message: string) => Promise<void>
    getChatMessagesById: (chatId: number) => Promise<void>
}

export const ChatContext = createContext<IChatContext>({
    messages: [],
    sendMessage: (message: string) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatMessagesById: (chatId: number) => {
        throw new Error('Контекст чата не проинициализирован')
    },
})

export const ChatContextProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<UserMessage[]>([])
    const { authUser } = useContext(AccountContext)
    const { openModal } = useContext(ModalContext)

    useEffect(() => {
        SignalRManager.instance.connection.on(
            'NewMessage',
            (message: UserMessage) => {
                message.isMy = authUser.login === message.userName
                message.createdAt = new Date().getTime()

                setMessages((existedMessages: UserMessage[]) => [
                    ...existedMessages,
                    message,
                ])
            }
        )
        return () => SignalRManager.instance.connection.off('NewMessage')
    }, [authUser])

    useEffect(() => {
        if (authUser.login === '') setMessages([])
    }, [authUser])

    const getChatMessagesById = async (chatId: number) => {
        const response = await chatRepository.getMessagesByChatId(chatId)
        if (response && response.status === 200) {
            const data: ApiResponse<UserMessage[]> = await response.json()
            setMessages(data.data)
        }
    }

    const sendMessage = (message: string) => {
        const sendMessageDto: SendMessageDto = {
            chatId: 1,
            userId: authUser.id,
            text: message,
            mediaId: null,
            replyId: null
        }
        return SignalRManager.instance
            .sendMessage<SendMessageDto>('NewMessage', sendMessageDto)
            .catch(() =>
                openModal(
                    'Внимание!',
                    'Не удалось отправить сообщение, потеряно соединение с сервером'
                )
            )
    }

    return (
        <ChatContext.Provider value={{ messages, sendMessage, getChatMessagesById }}>
            {children}
        </ChatContext.Provider>
    )
}
