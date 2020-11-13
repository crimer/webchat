import React from 'react'
import Header from './Components/Header'
import ChannelsBar from './Components/ChannelsBar'
import { ChatComponent } from './Components/ChatComponent'
import { AccountContextProvider } from './Contexts/AccountContext'
import { LogingDialogContextProvder } from './Contexts/LoginDialogContext'
import { ConnectionContextProvider } from './Contexts/ConnectionContext'
import { ModalContextProvider } from './Contexts/ModalContext'
import { CssBaseline, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gridTemplateRows: '64px 1fr',
        height: '100vh',
        width: '100%',
    },

}))

const App = () => {
    const classes = useStyles()

    return (
        <ModalContextProvider>
            <ConnectionContextProvider>
                <AccountContextProvider>
                    <CssBaseline />
                    <div className={classes.root}>
                        <LogingDialogContextProvder>
                            <Header />
                        </LogingDialogContextProvder>
                        <ChannelsBar />
                        <ChatComponent />
                    </div>
                </AccountContextProvider>
            </ConnectionContextProvider>
        </ModalContextProvider>
    )
}

export default App
