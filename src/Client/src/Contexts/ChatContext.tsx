import React, { useState, createContext, useEffect, useContext } from 'react'
import { UserChatDto } from '../common/Dtos/Chat/ChatDtos'
import {
    ReciveMessageDto,
    SendMessageDto,
} from '../common/Dtos/Chat/MessageDtos'
import chatRepository from '../repository/ChatRepository'
import messageRepository from '../repository/MessageRepository'
import { NewMessage } from '../SignalR/MessageTypes'
import SignalRManager from '../SignalR/SignalRManager'
import { AccountContext } from './AccountContext'
import { ToastContext } from './ToastContext'

interface IChatContext {
    chats: UserChatDto[]
    messages: ReciveMessageDto[]
    sendMessage: (message: string, chatId: number) => Promise<void>
    getMessages: (chatId: number, isPinned: boolean) => Promise<void>
    getChatMessagesById: (chatId: number) => Promise<boolean>
    getChatById: (chatId: number) => UserChatDto
    getPinnedMessagesByChatId: (chatId: number) => Promise<void>
    getChatsByUserId: (userId: number) => Promise<void>
    pinMessage: (messageId: number, isPin: boolean) => Promise<void>
}

export const ChatContext = createContext<IChatContext>({
    chats: [],
    messages: [],
    getChatById: (chatId: number) => {
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
    getMessages: (chatId: number, isPinned: boolean = false) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    pinMessage: (messageId: number, isPin: boolean) => {
        throw new Error('Контекст чата не проинициализирован')
    },
})

export const ChatContextProvider: React.FC = ({ children }) => {
    const [messages, setMessages] = useState<ReciveMessageDto[]>([])
    const [chats, setChats] = useState<UserChatDto[]>([])
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


    const getMessages = async (chatId: number, isPinned: boolean = false) => {
        if (isPinned) {
            await getPinnedMessagesByChatId(chatId)
        } else {
            await getChatMessagesById(chatId)
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
        const response = await chatRepository.getPinnedMessagesByChatId<ReciveMessageDto[]>(chatId)

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

    const pinMessage = async (messageId: number, isPin: boolean) => {
        const response = await messageRepository.togglePinMessage<undefined>(messageId, isPin)
        if(response && response.responseCode === 200){
            openToast({body:'Вы закрепили сообщение', type:'success'})
        }else if(response && response.errorMessage){
            openToast({body: response.errorMessage, type:'warning'})
        }
    }

    const sendMessage = (text: string, chatId: number) => {
        const sendMessageDto: SendMessageDto = {
            text,
            userId: authUser.id,
            chatId,
        }
        return SignalRManager.instance
            .sendMessage<SendMessageDto>(NewMessage, sendMessageDto)
            .catch(() => {
                openToast({body:'Не удалось отправить сообщение, потеряно соединение с сервером', type:'error'})
            })
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                messages,
                sendMessage,
                getChatById,
                getMessages,
                getChatMessagesById,
                getPinnedMessagesByChatId,
                getChatsByUserId,
                pinMessage,
            }}>
            {children}
        </ChatContext.Provider>
    )
}
