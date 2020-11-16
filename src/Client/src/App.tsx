import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { AccountContextProvider } from './Contexts/AccountContext'
import { LogingDialogContextProvder } from './Contexts/LoginDialogContext'
import { ConnectionContextProvider } from './Contexts/ConnectionContext'
import { ModalContextProvider } from './Contexts/ModalContext'
import AppTemplate from './pages/AppTemplate'

const App = () => {
    return (
        <ModalContextProvider>
            <ConnectionContextProvider>
                <AccountContextProvider>
                    <LogingDialogContextProvder>
                        <CssBaseline />
                        <AppTemplate />
                    </LogingDialogContextProvder>
                </AccountContextProvider>
            </ConnectionContextProvider>
        </ModalContextProvider>
    )
}

export default App
