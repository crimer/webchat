import React from 'react'
import { CssBaseline } from '@material-ui/core'
import { AccountContextProvider } from './Contexts/AccountContext'
import { ConnectionContextProvider } from './Contexts/ConnectionContext'
import { ModalContextProvider } from './Contexts/ModalContext'
import AppTemplate from './pages/AppTemplate'

const App = () => {
    return (
        <ModalContextProvider>
            <ConnectionContextProvider>
                <AccountContextProvider>
                    <CssBaseline />
                    <AppTemplate />
                </AccountContextProvider>
            </ConnectionContextProvider>
        </ModalContextProvider>
    )
}

export default App
