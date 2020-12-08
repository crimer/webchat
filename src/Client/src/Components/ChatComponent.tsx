import React, {
    useRef,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} from 'react'
import { ChatContext } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { DateType, formatDate } from '../libs/DateFormat'
import { makeStyles, TextField } from '@material-ui/core'
import { Header } from './Header'
import { useHistory, useParams } from 'react-router-dom'
import StarBorderIcon from '@material-ui/icons/StarBorder'
import StarIcon from '@material-ui/icons/Star'
import { ReciveMessageDto } from '../common/Dtos/Chat/MessageDtos'
import { UserChatDto } from '../common/Dtos/Chat/ChatDtos'

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    content: {
        gridRow: 2,
        gridColumn: 2,
        overflow: 'hidden',
        width: '100%',
        height: '100%',
    },
    container: {
        width: '100%',
        height: 'calc(100% - 64px)',
        display: 'flex',
        flexFlow: 'column nowrap',
    },
    messageList: {
        display: 'flex',
        flexFlow: 'column nowrap',
        overflowY: 'scroll',
        flex: '1 1 auto',
        '&::-webkit-scrollbar': {
            width: '5xp',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgb(193, 193, 193)',
        },
        '&::-webkit-scrollbar-track': {
            webkitBoxShadow: 'inset 0 0 6px rgba(0, 0, 0, 0.3)',
        },
    },
    messageFooter: {
        marginTop: 'auto',
        display: 'flex',
        height: '25px',
        flexFlow: 'row-reverse',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    message: {
        height: '92px',
        backgroundColor: 'white',
        filter: 'drop-shadow(0px 3px 6px rgba(0, 0, 0, 0.36))',
        padding: '1em 1.5em',
        borderRadius: '7px',
        wordBreak: 'break-word',
        maxWidth: '35vw',
        minWidth: '200px',
        display: 'flex',
        flexFlow: 'column nowrap',
    },
    messageTime: {
        color: '#a0a0a0',
    },
    messageRow: {
        padding: '0.5em',
        display: 'flex',
        justifyContent: 'flex-end',
        flexFlow: 'row nowrap',
        animation: 'showing 1s',
    },
    messageRowMy: {
        alignSelf: 'flex-end',
        flexDirection: 'row-reverse',
    },
    messageRowAnother: {
        alignSelf: 'flex-start',
        flexDirection: 'row',
    },
    userLogo: {
        padding: '20px',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '100%',
        textAlign: 'center',
        display: 'flex',
        height: '25px',
        width: '25px',
        alignSelf: 'flex-end',
        fontWeight: 'bold',
        color: 'white',
    },
    userLogoMy: {
        justifySelf: 'start',
    },
    userLogoAnother: {
        justifySelf: 'end',
    },
    favMessage: {
        display: 'none',
    },
    myMessage: {
        justifySelf: 'start',
        marginRight: '15px',
        '&::before': {
            content: '',
            position: 'absolute',
            visibility: 'visible',
            bottom: '0px',
            right: '-11px',
            border: '10px solid transparent',
            borderBottom: '10px solid #ccc',
        },
        '&::after': {
            content: '',
            position: 'absolute',
            visibility: 'visible',
            bottom: '0px',
            right: '-11px',
            border: '10px solid transparent',
            borderBottom: '10px solid whitesmoke',
        },
        '&:hover $favMessage': {
            display: 'block',
        },
    },
    anotherMessage: {
        justifySelf: 'end',
        marginLeft: '15px',
        '&::before': {
            content: '',
            position: 'absolute',
            visibility: 'visible',
            bottom: '0px',
            left: '-11px',
            border: '10px solid transparent',
            borderBottom: '10px solid #ccc',
        },
        '&::after': {
            content: '',
            position: 'absolute',
            visibility: 'visible',
            bottom: '0px',
            left: '-11px',
            border: '10px solid transparent',
            borderBottom: '10px solid whitesmoke',
        },
    },
    inputWrapper: {
        padding: '20px',
    },
    pinnedMessage: {
        display: 'block !important',
    },
    emptyChatList: {
        display: 'block',
        margin: '20px 0',
        textAlign: 'center',
        fontSize: '20px',
    },
}))

interface IMessageBlockProps {
    message: ReciveMessageDto
}

const ChatMessageListComponent: React.FC = () => {
    const { messages } = useContext(ChatContext)
    const { authUser } = useContext(AccountContext)
    const bottomRef = useRef<HTMLDivElement>(null)
    const classes = useStyles()

    const scrollToBottom = () => {
        if (!bottomRef.current) return
        bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }

    // const messages = getMessages(isPinned)
    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
        <div className={classes.messageList}>
            {messages.length === 0 && (
                <p className={classes.emptyChatList}>Сообщений нет</p>
            )}
            {authUser.login !== '' &&
                messages.map((m) => (
                    <ChatMessagesBlockComponent key={m.id} message={m} />
                ))}
            <span ref={bottomRef}></span>
        </div>
    )
}

const ChatMessagesBlockComponent: React.FC<IMessageBlockProps> = ({
    message,
}: IMessageBlockProps) => {
    const { authUser } = useContext(AccountContext)
    const { pinMessage } = useContext(ChatContext)

    const { userName, text, createdAt, isPinned } = message
    const classes = useStyles()
    const names = userName.split(' ')

    const messageRowClasses = `${classes.messageRow} ${
        authUser.login === userName
            ? classes.messageRowMy
            : classes.messageRowAnother
    }`
    const userLogoClasses = `${classes.userLogo} ${
        authUser.login === userName
            ? classes.userLogoMy
            : classes.userLogoAnother
    }`
    const messageTextClasses = `${classes.message} ${
        authUser.login === userName ? classes.myMessage : classes.anotherMessage
    }`

    const pinnedClasses = `${classes.favMessage} ${
        message.isPinned && classes.pinnedMessage
    }`

    const userInitials = useMemo(
        () =>
            names.reduce(
                (result, currentName) =>
                    (result += currentName[0].toUpperCase()),
                ''
            ),
        [userName]
    )

    const stringToColour = useCallback((): string => {
        let hash = 0
        for (let i = 0; i < userInitials.length; i++) {
            hash = userInitials.charCodeAt(i) + ((hash << 5) - hash)
        }
        let colour = '#'
        for (let i = 0; i < 3; i++) {
            let value = (hash >> (i * 7)) & 0xff
            colour += ('00' + value.toString(16)).substr(-2)
        }
        return colour
    }, [userInitials])

    const style = {
        backgroundColor: stringToColour(),
    }

    const handlePinClick = async () => await pinMessage(+message.id, !message.isPinned)

    return (
        <span className={messageRowClasses}>
            <span style={style} className={userLogoClasses}>
                {userInitials}
            </span>
            <div className={messageTextClasses}>
                <span>{text}</span>
                <div className={classes.messageFooter}>
                    <span className={classes.messageTime}>
                        {formatDate(createdAt, DateType.DateTime)}
                    </span>
                    {authUser.login === userName && (
                        <span
                            className={pinnedClasses}
                            onClick={handlePinClick}>
                            {isPinned ? (
                                <StarIcon fontSize='small' />
                            ) : (
                                <StarBorderIcon fontSize='small' />
                            )}
                        </span>
                    )}
                </div>
            </div>
        </span>
    )
}

const ChatInputBlockComponent: React.FC = () => {
    const { sendMessage } = useContext(ChatContext)
    const { authUser } = useContext(AccountContext)
    const [message, setMessage] = useState('')
    const classes = useStyles()
    const { chatId } = useParams()

    useEffect(() => {
        setMessage('')
    }, [authUser])

    const onEnter = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (message.trim().length > 0 && +chatId > 0) {
                await sendMessage(message, +chatId)
            }
            setMessage('')
        }
    }

    return (
        <div className={classes.inputWrapper}>
            <TextField
                placeholder={'Введите сообщение'}
                value={message}
                onKeyDown={(event) => onEnter(event)}
                onChange={(event) => setMessage(event.target.value)}
                disabled={authUser.login === ''}
                rows={1}
                fullWidth
            />
        </div>
    )
}

export const ChatComponent: React.FC = () => {
    const classes = useStyles()
    const { chatId } = useParams()
    const history = useHistory()
    const [chat, setChat] = useState<UserChatDto>()
    const { getChatMessagesById, getChatById } = useContext(ChatContext)

    useEffect(() => {
        const fetchChatData = async () => {
            const hasMessages = await getChatMessagesById(chatId)
            if (!hasMessages) {
                history.push('/chat/')
                return
            }
            const currentChat = getChatById(chatId)
            setChat(currentChat)
        }

        if (chatId) {
            fetchChatData()
        }
    }, [chatId])

    return (
        <main className={classes.content}>
            <Header chat={chat} />

            <div className={classes.container}>
                <ChatMessageListComponent />
                <ChatInputBlockComponent />
            </div>
        </main>
    )
}
