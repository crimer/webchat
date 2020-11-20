import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { AccountContextProvider } from './Contexts/AccountContext'
import { ConnectionContextProvider } from './Contexts/ConnectionContext'
import { ModalContextProvider } from './Contexts/ModalContext'
import AppTemplate from './pages/AppTemplate'
import { ChatContextProvider } from './Contexts/ChatContext'
import { ToastContextProvider } from './Contexts/ToastContext'

const App = () => {
    return (
        <ModalContextProvider>
            <ToastContextProvider>
                <ConnectionContextProvider>
                    <AccountContextProvider>
                        <ChatContextProvider>
                            <CssBaseline />
                            <AppTemplate />
                        </ChatContextProvider>
                    </AccountContextProvider>
                </ConnectionContextProvider>
            </ToastContextProvider>
        </ModalContextProvider>
    )
}

export default App
