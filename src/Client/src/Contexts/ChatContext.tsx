import React, { useState, createContext, useEffect, useContext } from 'react'
import { UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import {
    ReciveMessageDto,
    SendMessageDto,
} from '../common/Dtos/Chat/MessageDtos'
import chatRepository from '../repository/ChatRepository'
import SignalRManager from '../SignalR/SignalRManager'
import { AccountContext } from './AccountContext'
import { ModalContext } from './ModalContext'
import { ToastContext } from './ToastContext'

interface IChatContext {
    chats: UserChatDto[]
    isPinned: boolean
    getMessages: (isPinned: boolean) => ReciveMessageDto[]
    setPinned: (isPinned: boolean) => void
    sendMessage: (message: string, chatId: number) => Promise<void>
    getChatMessagesById: (chatId: number) => Promise<boolean>
    getChatById: (chatId: number) => UserChatDto
    getPinnedMessagesByChatId: (chatId: number) => Promise<void>
    getChatsByUserId: (userId: number) => Promise<void>
}

export const ChatContext = createContext<IChatContext>({
    chats: [],
    isPinned: false,
    getMessages: (sPinned: boolean) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatById: (chatId: number) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    setPinned: (isPinned: boolean) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    sendMessage: (message: string) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatMessagesById: (chatId: number): Promise<boolean> => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getPinnedMessagesByChatId: (chatId: number) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatsByUserId: (userId: number) => {
        throw new Error('Контекст чата не проинициализирован')
    },
})

export const ChatContextProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<ReciveMessageDto[]>([])
    const [chats, setChats] = useState<UserChatDto[]>([])
    const [isPinned, setIsPinned] = useState<boolean>(false)
    const { authUser } = useContext(AccountContext)
    const { openToast } = useContext(ToastContext)

    useEffect(() => {
        SignalRManager.instance.connection.on(
            'NewMessage',
            (message: ReciveMessageDto) => {
                message.isMy = authUser.login === message.userName
                message.createdAt = new Date().getTime()

                setMessages((existedMessages: ReciveMessageDto[]) => [
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

    const setPinned = (pinned: boolean) => setIsPinned(pinned)

    const getMessages = (pinned: boolean = false) => {
        if (pinned) {
            return messages.filter((message) => message.isPinned === pinned)
        } else {
            return messages
        }
    }

    const getChatMessagesById = async (chatId: number): Promise<boolean> => {
        const response = await chatRepository.getMessagesByChatId<ReciveMessageDto[]>(chatId)
        let hasMessages = false
        if (response && response.responseCode === 200) {
            setMessages(response.data)
            hasMessages = true
        } else if (response && response.responseCode === 404){
            openToast({body: 'Невозможно получить сообщения этого чата', type:'warning'})
        }
        return hasMessages
    }
    const getChatById = (chatId: number) => chats.filter(chat => chat.id === +chatId)[0]

    const getPinnedMessagesByChatId = async (chatId: number) => {
        const response = await chatRepository.getMessagesByChatId<ReciveMessageDto[]>(chatId)
        if (response && response.responseCode === 200) {
            setMessages(response.data)
        } else if (response && response.responseCode === 404){
            openToast({body: 'Невозможно получить сообщения этого чата', type:'warning'})
        }
    }

    const getChatsByUserId = async (userId: number) => {
        const response = await chatRepository.getChatsByUserId<UserChatDto[]>(userId)
        if (response && response.responseCode === 200) {
            setChats(response.data)
        }
    }

    const sendMessage = (text: string, chatId: number) => {
        const sendMessageDto: SendMessageDto = {
            text,
            userId: authUser.id,
            chatId,
            replyId: null,
            mediaId: null,
        }
        return SignalRManager.instance
            .sendMessage<SendMessageDto>('NewMessage', sendMessageDto)
            .catch(() => {
                openToast({body:'Не удалось отправить сообщение, потеряно соединение с сервером', type:'error'})
            })
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                sendMessage,
                getChatById,
                setPinned,
                getMessages,
                isPinned,
                getChatMessagesById,
                getPinnedMessagesByChatId,
                getChatsByUserId,
            }}>
            {children}
        </ChatContext.Provider>
    )
}
