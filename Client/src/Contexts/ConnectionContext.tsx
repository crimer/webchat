import React, { createContext, useState, useEffect, useContext } from 'react'
import SignalRManager from '../SignalR/SignalRManager'

interface IConnectionContext {
    isConnected: boolean
    startConnection(): void
    stopConnection(): void
    reconnectConnection(): void
}

export const ConnectionContext = createContext<IConnectionContext>({
    isConnected: false,
    startConnection: () => {
        throw new Error('Контекст подключения не проинициализирован')
    },
    stopConnection: () => {
        throw new Error('Контекст подключения не проинициализирован')
    },
    reconnectConnection: () => {
        throw new Error('Контекст подключения не проинициализирован')
    },
})

export const ConnectionContextProvider: React.FC = ({ children }) => {
    const [isConnected, setIsConnected] = useState<boolean>(false)

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

    const reconnectConnection = () => {
        SignalRManager.instance
            .reconnect()
            .then(() => {
                setIsConnected(true)
            })
            .catch((error) => {
                console.log('SignalRManager reconnection error', error)
                setIsConnected(false)
            })
    }

    return (
        <ConnectionContext.Provider
            value={{ isConnected, startConnection, stopConnection, reconnectConnection }}>
            {children}
        </ConnectionContext.Provider>
    )
}
