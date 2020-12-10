import React, { useState, useContext, useEffect } from 'react'
import accountRepository from '../repository/AccountRepository'
import { ConnectionContext } from './ConnectionContext'
import Cookies from 'js-cookie'
import { useHistory } from 'react-router-dom'
import { ToastContext } from './ToastContext'
import { AuthUserDto, UserProfileDto, UserRole } from '../common/Dtos/User/UserDtos'
import usersRepository from '../repository/UsersRepository'

const initUserValue: AuthUserDto = {
    id: -1,
    login: '',
}

interface IAccountContext {
    authUser: AuthUserDto
    login: (name: string, password: string) => Promise<boolean>
    register: (login: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    autoStartConnection: () => Promise<void>
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
    autoStartConnection: () => {
        throw Error('Не проинициализирован контекст авторизации')
    },
})

export const AccountContextProvider: React.FC = ({ children }) => {
    const [authUser, setAuthUser] = useState<AuthUserDto>(initUserValue)
    const { openToast } = useContext(ToastContext)
    const { startConnection, stopConnection } = useContext(ConnectionContext)
    const history = useHistory()

    const autoStartConnection = async () => {
        const cookieUserDataJson = Cookies.get('userData')

        if (cookieUserDataJson !== undefined) {
            const userData: AuthUserDto = JSON.parse(cookieUserDataJson)
            setAuthUser(userData)
            await startConnection()
            history.push('/chat/')
        } else {
            history.push('/login')
        }
    }


    const login = async (login: string, password: string) => {
        const response = await accountRepository
            .login<AuthUserDto>(login, password)
            .catch(() =>
                openToast({
                    body:
                        'Извините, не удалось подключиться к серверу, повторите попытку позже',
                        type:'error'
                })
            )
        if (response && response.isValid) {
            setAuthUser(response.data)
            Cookies.set('userData', JSON.stringify(response.data), {
                expires: 1,
                path: '/',
            })
            await startConnection()
            return true
        } else if (response) {
            openToast({
                body: `При авторизации произошла ошибка. ${response.errorMessage}`,
                type:'error'
            })
        }
        return false
    }

    const register = async (login: string, password: string) => {
        const response = await accountRepository
            .register(login, password)
            .catch(() =>
                openToast({
                    body:
                        'Извините, не удалось подключиться к серверу, повторите попытку позже',
                        type:'error'
                })
            )

        if (response && response.responseCode === 200) {
            return true
        } else {
            openToast({ body: `При авторизации произошла ошибка.`, type:'error' })
            return false
        }
    }

    const logout = async () => {
        const response = await accountRepository
            .logout()
            .catch(() =>
                openToast({
                    body:
                        'Извините, не удалось подключиться к серверу, повторите попытку позже', type:'error'
                })
            )

        if (response && response.status === 200) {
            setAuthUser(initUserValue)
            await stopConnection()
            Cookies.remove('userData')
            return Promise.resolve()
        } else if (response) {
            Cookies.remove('userData')
            openToast({
                body: `При выходе произошла ошибка. ${response.statusText}`, type:'error'
            })
            return Promise.reject()
        }
    }

    return (
        <AccountContext.Provider value={{ authUser, login, logout, register, autoStartConnection }}>
            {children}
        </AccountContext.Provider>
    )
}
