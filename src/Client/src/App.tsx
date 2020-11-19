import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { AccountContextProvider } from './Contexts/AccountContext'
import { ConnectionContextProvider } from './Contexts/ConnectionContext'
import { ModalContextProvider } from './Contexts/ModalContext'
import AppTemplate from './pages/AppTemplate'
import { ChatContextProvider } from './Contexts/ChatContext'

const App = () => {
    return (
        <ModalContextProvider>
            <ConnectionContextProvider>
                <AccountContextProvider>
                    <ChatContextProvider>
                        <CssBaseline />
                        <AppTemplate />
                    </ChatContextProvider>
                </AccountContextProvider>
            </ConnectionContextProvider>
        </ModalContextProvider>
    )
}

export default App
