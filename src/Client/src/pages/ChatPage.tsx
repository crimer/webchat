import React, { useContext, useEffect } from 'react'
import Header from '../Components/Header'
import ChannelsBar from '../Components/ChannelsBar'
import { ChatComponent } from '../Components/ChatComponent'
import { makeStyles } from '@material-ui/core'
import { ChatContext } from '../Contexts/ChatContext'
import { Route, Switch, useParams } from 'react-router-dom'

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
    const { chatId } = useParams()
    console.log(chatId)

    useEffect(() => {
        getChatMessagesById(1)
    }, [])

    return (
        <div className={classes.root}>
            <Header />
            <ChannelsBar />
            <div>

            <Switch>
                <Route exact path='/channel:chatId' component={ChatComponent} />
                <Route exact path='/group:chatId' component={ChatComponent} />
                <Route exact path='/direct:chatId' component={ChatComponent} />
            </Switch>
            </div>
            {/* <ChatComponent /> */}
        </div>
    )
}

export default ChatPage
