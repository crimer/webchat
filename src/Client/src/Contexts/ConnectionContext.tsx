import React, { createContext, useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom'
import SignalRManager from '../SignalR/SignalRManager'
import { ToastContext } from './ToastContext'

interface IConnectionContext {
    startConnection(): void
    stopConnection(): void
}

export const ConnectionContext = createContext<IConnectionContext>({
    startConnection: () => {
        throw new Error('Контекст подключения не проинициализирован')
    },
    stopConnection: () => {
        throw new Error('Контекст подключения не проинициализирован')
    },
})

export const ConnectionContextProvider: React.FC = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false)
    const { openToast } = useContext(ToastContext)
    const history = useHistory()

    useEffect(() => {
        if(isConnected) openToast({body: 'Соединение есть', type:'success'})
        else {
            openToast({body: 'Потеряно соединение ', type:'warning'})
            history.push('/login')
        }
    }, [isConnected])

    const startConnection = () => {
        return SignalRManager.instance
            .start()
            .then(() => {
                setIsConnected(true)
            })
            .catch((error) => setIsConnected(false))
    }

    const stopConnection = () => {
        SignalRManager.instance
            .stop()
            .catch((error) =>
                console.log('SignalRManager connection error', error)
            )
            .finally(() => setIsConnected(false))
    }

    return (
        <ConnectionContext.Provider value={{ startConnection, stopConnection }}>
            {children}
        </ConnectionContext.Provider>
    )
}
