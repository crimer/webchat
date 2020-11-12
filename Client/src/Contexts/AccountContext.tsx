import React, { useState, useContext } from 'react'
import accountRepository from '../repository/AccountRepository'
import { ConnectionContext } from './ConnectionContext'
import { ModalContext } from './ModalContext'

interface IAccountContext {
    currentUserName: string
    login: (name: string) => Promise<boolean>
    logout: () => void
}

export const AccountContext = React.createContext<IAccountContext>({
    currentUserName: '',
    login: (name: string) => {
        throw Error('Не проинициализирован контекст авторизации')
    },
    logout: () => {
        throw Error('Не проинициализирован контекст авторизации')
    },
})

export const AccountContextProvider: React.FC = ({ children }) => {
    const [currentUserName, setUserName] = useState('')
    const { openModal } = useContext(ModalContext)
    const { startConnection, stopConnection } = useContext(ConnectionContext)

    const login = async (userName: string) => {
        const response = await accountRepository
            .login(userName)
            .catch((e) =>
                openModal(
                    'Ошибка подключения',
                    'Извините, не удалось подключиться к серверу, повторите попытку позже'
                )
            )

        if (response && response.status === 200) {
            await startConnection()
            const json = await response.json()
            setUserName(json.name)
            return true
        } else if (response) {
            openModal('Ошибка авторизации', `При авторизации произошла ошибка. ${response.statusText}`)
        }
        return false
    }

    const logout = async () => {
        const response = await accountRepository
            .logout()
            .catch((e) =>
                openModal(
                    'Ошибка подключения',
                    'Извините, не удалось подключиться к серверу, повторите попытку позже'
                )
            )
        if (response && response.status === 200) {
            setUserName('')
            await stopConnection()
        } else if (response) {
            openModal('Ошибка выхода', `При выходе произошла ошибка. ${response.statusText}`)
        }
    }

    return (
        <AccountContext.Provider value={{ currentUserName, login, logout }}>
            {children}
        </AccountContext.Provider>
    )
}
