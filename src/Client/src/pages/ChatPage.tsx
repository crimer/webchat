import React, { useContext, useEffect } from 'react'
import Header from '../Components/Header'
import ChannelsBar from '../Components/ChannelsBar'
import { ChatComponent } from '../Components/ChatComponent'
import { makeStyles } from '@material-ui/core'
import { ChatContext } from '../Contexts/ChatContext'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gridTemplateRows: '64px 1fr',
        height: '100vh',
        width: '100%',
    },
}))

const ChatPage = () => {
    const classes = useStyles()
    const { getChatMessagesById } = useContext(ChatContext)

    useEffect(() => {
        getChatMessagesById(1)
    }, [])

    return (
        <div className={classes.root}>
            <Header />
            <ChannelsBar />
            <ChatComponent />
        </div>
    )
}

export default ChatPage
