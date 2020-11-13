import React, {
    useRef,
    useCallback,
    useContext,
    useMemo,
    useEffect,
    useState,
} from 'react'
import '../styles/Chat.css'
import { ChatContext, ChatContextProvider } from '../Contexts/ChatContext'
import { AccountContext } from '../Contexts/AccountContext'
import { formatDate } from '../libs/DateFormat'
import { makeStyles, TextField } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    appBarSpacer: theme.mixins.toolbar,
    content: {
        gridRow: 2,
        gridColumn: 2,
        padding: theme.spacing(4),
        overflow: 'auto',
        width: '100%',
        height: '100%',
    },
    container: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexFlow: 'column nowrap',
    },
}))

interface IMessageBlockProps {
    message: MessageBlock
}

type MessageBlock = {
    userName: string
    isMy: boolean
    text: string
    time: number
}

const ChatMessageListComponent: React.FC = () => {
    const { messages } = useContext(ChatContext)
    const { currentUserName } = useContext(AccountContext)
    const bottomRef = useRef<HTMLDivElement>(null)

    const scrollToBottom = () => {
        if (!bottomRef.current) return
        bottomRef.current.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        })
    }
    useEffect(() => {
        scrollToBottom()
    }, [messages])
    return (
        <div className='message-list'>
            {currentUserName !== '' &&
                messages.map((m) => (
                    <ChatMessagesBlockComponent key={m.time} message={m} />
                ))}
            <div ref={bottomRef}></div>
        </div>
    )
}

const ChatMessagesBlockComponent: React.FC<IMessageBlockProps> = ({
    message,
}: IMessageBlockProps) => {
    const { userName, isMy, text, time } = message
    const names = userName.split(' ')

    const messageRowClasses = `message-row ${
        isMy ? 'message-row-my' : 'message-row-another'
    }`
    const userLogoClasses = `user-logo ${
        isMy ? 'user-logo-my' : 'user-logo-another'
    }`
    const messageTextClasses = `message ${
        isMy ? 'my-message' : 'another-message'
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

    return (
        <span className={messageRowClasses}>
            <span style={style} className={userLogoClasses}>
                {userInitials}
            </span>
            <div className={messageTextClasses}>
                <span>{text}</span>
                <span className='message-time'>{formatDate(time)}</span>
            </div>
        </span>
    )
}

const ChatInputBlockComponent: React.FC = () => {
    const { sendMessage } = useContext(ChatContext)
    const { currentUserName } = useContext(AccountContext)
    const [message, setMessage] = useState('')

    useEffect(() => {
        setMessage('')
    }, [currentUserName])

    const onEnter = async (event: React.KeyboardEvent<HTMLDivElement>) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            if (message.trim().length > 0) await sendMessage(message)
            setMessage('')
        }
    }

    return (
        <div>
            <TextField
                placeholder={'Введите сообщение'}
                value={message}
                onKeyDown={(event) => onEnter(event)}
                onChange={(event) => setMessage(event.target.value)}
                disabled={currentUserName === ''}
                rows={1}
                fullWidth
            />
        </div>
    )
}

export const ChatComponent: React.FC = () => {
    const classes = useStyles()

    return (
        <ChatContextProvider>
            <main className={classes.content}>
                <div className={classes.container}>
                    <ChatMessageListComponent />
                    <ChatInputBlockComponent />
                </div>
            </main>
        </ChatContextProvider>
    )
}
