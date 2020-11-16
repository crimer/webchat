import React from 'react'
import Header from '../Components/Header'
import ChannelsBar from '../Components/ChannelsBar'
import { ChatComponent } from '../Components/ChatComponent'
import { makeStyles } from '@material-ui/core'

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
    return (
        <div className={classes.root}>
            <Header />
            <ChannelsBar />
            <ChatComponent />
        </div>
    )
}

export default ChatPage
