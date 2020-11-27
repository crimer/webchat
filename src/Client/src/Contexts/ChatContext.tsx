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

interface IChatContext {
    chats: UserChatDto[]
    isPinned: boolean
    getMessages: (isPinned: boolean) => ReciveMessageDto[]
    setPinned: (isPinned: boolean) => void
    sendMessage: (message: string, chatId: number) => Promise<void>
    getChatById: (chatId: number) => UserChatDto
    getChatMessagesById: (chatId: number) => Promise<void>
    getPinnedMessagesByChatId: (chatId: number) => Promise<void>
    getChatsByUserId: (userId: number) => Promise<void>
}

export const ChatContext = createContext<IChatContext>({
    chats: [],
    isPinned: false,
    getMessages: (sPinned: boolean) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatById: (chatId: number): UserChatDto => {
        throw new Error('Контекст чата не проинициализирован')
    },
    setPinned: (isPinned: boolean) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    sendMessage: (message: string) => {
        throw new Error('Контекст чата не проинициализирован')
    },
    getChatMessagesById: (chatId: number) => {
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
    const { openModal } = useContext(ModalContext)

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

    const getChatMessagesById = async (chatId: number) => {
        const response = await chatRepository.getMessagesByChatId<
            ReciveMessageDto[]
        >(chatId)
        if (response && response.responseCode === 200) {
            setMessages(response.data)
        }
    }

    const getPinnedMessagesByChatId = async (chatId: number) => {
        const response = await chatRepository.getMessagesByChatId<ReciveMessageDto[]>(chatId)
        if (response && response.responseCode === 200) {
            setMessages(response.data)
        }
    }

    const getChatsByUserId = async (userId: number) => {
        const response = await chatRepository.getChatsByUserId<UserChatDto[]>(
            userId
        )
        if (response && response.responseCode === 200) {
            setChats(response.data)
        }
    }

    const getChatById = (chatId: number): UserChatDto => chats.filter(chat => chat.id === chatId)[0]

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
            .catch((e) => {
                openModal(
                    'Внимание!',
                    'Не удалось отправить сообщение, потеряно соединение с сервером'
                )
            })
    }

    return (
        <ChatContext.Provider
            value={{
                chats,
                sendMessage,
                setPinned,
                getMessages,
                getChatById,
                isPinned,
                getChatMessagesById,
                getPinnedMessagesByChatId,
                getChatsByUserId,
            }}>
            {children}
        </ChatContext.Provider>
    )
}
