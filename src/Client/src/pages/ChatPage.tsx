import React from 'react'
import { ChannelsBar } from '../Components/ChannelsBar'
import { ChatComponent } from '../Components/ChatComponent'
import { Container, makeStyles } from '@material-ui/core'
import { Route } from 'react-router-dom'
import { ChatDetailPage } from '../pages/ChatDetailPage'

const useStyles = makeStyles(() => ({
    root: {
        display: 'flex',
        flexFlow: 'row nowrap',
        height: '100vh',
        width: '100%',
    },
}))

export const ChatPage = () => {
    const classes = useStyles()

    return (
        <div className={classes.root}>
            <ChannelsBar />
            <Route exact path='/chat/:chatId' component={ChatComponent} />
            <Route exact path='/chat/:chatId/detail' component={ChatDetailPage} />
            <Route exact path='/chat'>
                <Container>
                    <h1>Главная</h1>
                    <h3>Добро пожаловать в Mega Chat</h3>
                    <h3>Выберите или создайте чат</h3>
                </Container>
            </Route>
        </div>
    )
}

