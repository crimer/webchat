import React, { useState, useContext, useEffect } from 'react'
import accountRepository from '../repository/AccountRepository'
import { ConnectionContext } from './ConnectionContext'
import { ModalContext } from './ModalContext'
import Cookies from 'js-cookie'
import { useHistory } from 'react-router-dom'
import { apiRequest, ApiResponse } from '../common/Api/ApiHelper'

type AuthUser = {
    id: number
    login: string
}

const initUserValue: AuthUser = {
    id: -1,
    login: '',
}

interface IAccountContext {
    authUser: AuthUser
    login: (name: string) => Promise<boolean>
    logout: () => void
}

export const AccountContext = React.createContext<IAccountContext>({
    authUser: initUserValue,
    login: (name: string) => {
        throw Error('Не проинициализирован контекст авторизации')
    },
    logout: () => {
        throw Error('Не проинициализирован контекст авторизации')
    },
})

export const AccountContextProvider: React.FC = ({ children }) => {
    const [authUser, setAuthUser] = useState<AuthUser>(initUserValue)
    const { openModal } = useContext(ModalContext)
    const { startConnection, stopConnection } = useContext(ConnectionContext)
    const history = useHistory()

    useEffect(() => {
        const autoStartConnection = async () => {
            const cookieUserDataJson = Cookies.get('userData')

            if (cookieUserDataJson !== undefined) {
                const userData: AuthUser = JSON.parse(cookieUserDataJson)
                await startConnection()
                setAuthUser(userData)
            } else {
                history.push('/login')
            }
        }
        autoStartConnection()
    }, [])

    const login = async (userName: string) => {
        // const response = await accountRepository
        //     .login<AuthUser>(userName)
        //     .catch((e: Error) => openModal('Ошибка подключения', 'Извините, не удалось подключиться к серверу, повторите попытку позже'))

        const response = await accountRepository.login(userName)
            .catch((e: Error) => openModal('Ошибка подключения', 'Извините, не удалось подключиться к серверу, повторите попытку позже'))

        if (response && response.status === 200) {
            const data: ApiResponse<AuthUser> = await response.json()
            await startConnection()
            setAuthUser(data.data)
            Cookies.set('userData', JSON.stringify(data.data), { expires: 1, path: '/', })
            return true

        } else if (response) {
            openModal(
                'Ошибка авторизации',
                `При авторизации произошла ошибка. ${response.statusText}`
            )
        }
        return false
    }

    const logout = async () => {
        const response = await accountRepository
            .logout()
            .catch((e) => openModal('Ошибка подключения', 'Извините, не удалось подключиться к серверу, повторите попытку позже'))

        if (response && response.status === 200) {
            setAuthUser(initUserValue)
            await stopConnection()
            Cookies.remove('userData')
        } else if (response) {
            openModal(
                'Ошибка выхода',
                `При выходе произошла ошибка. ${response.statusText}`
            )
        }
    }

    return (
        <AccountContext.Provider value={{ authUser, login, logout }}>
            {children}
        </AccountContext.Provider>
    )
}
