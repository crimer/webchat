import React, { useContext, useEffect } from 'react'
import { Switch, Route, useHistory } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { ChatPage } from './ChatPage'
import { UserFrofilePage } from './UserProfilePage'
import { AccountContext } from '../Contexts/AccountContext'

const AppTemplate = () => {
    const { autoStartConnection } = useContext(AccountContext)
    useEffect(() => {
        autoStartConnection()
    }, [])
    return (
        <Switch>
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={RegisterPage} />
            <Route exact path='/profile/:id' component={UserFrofilePage} />
            <Route exact path='/chat/*' component={ChatPage} />
        </Switch>
    )
}

export default AppTemplate
