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
    login: (name: string, password: string) => Promise<boolean>
    register: (login: string, password: string) => Promise<boolean>
    logout: () => void
}

export const AccountContext = React.createContext<IAccountContext>({
    authUser: initUserValue,
    login: (name: string, password: string) => {
        throw Error('Не проинициализирован контекст авторизации')
    },
    logout: () => {
        throw Error('Не проинициализирован контекст авторизации')
    },
    register: (login: string, password: string) => {
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

    const login = async (login: string, password: string) => {
        const response = await accountRepository
            .login<AuthUser>(login, password)
            .catch((e: Error) =>
                openModal(
                    'Ошибка подключения',
                    'Извините, не удалось подключиться к серверу, повторите попытку позже'
                )
            )

        if (response && response.isValid) {
            setAuthUser(response.data)
            Cookies.set('userData', JSON.stringify(response.data), {
                expires: 1,
                path: '/',
            })
            return true
        } else if (response ) {
            openModal(
                'Ошибка авторизации',
                `При авторизации произошла ошибка. ${response.errorMessage}`
            )
        }
        return false
    }

    const register = async (login: string, password: string) => {
        const response = await accountRepository
            .register(login, password)
            .catch((e: Error) =>
                openModal(
                    'Ошибка подключения',
                    'Извините, не удалось подключиться к серверу, повторите попытку позже'
                )
            )

        if (response && response.responseCode === 200) {
            return true
        } else {
            console.log(response);

            openModal(
                'Ошибка авторизации',
                `При авторизации произошла ошибка.`
            )
            return false
        }
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
        <AccountContext.Provider value={{ authUser, login, logout, register }}>
            {children}
        </AccountContext.Provider>
    )
}
