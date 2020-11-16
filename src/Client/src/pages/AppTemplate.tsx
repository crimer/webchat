import React from 'react'
import { Switch, Route } from 'react-router-dom'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import ChatPage from './ChatPage'

const AppTemplate = () => {
    return (
        <Switch>
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={RegisterPage} />
            <Route exact path='/' component={ChatPage} />
        </Switch>
    )
}

export default AppTemplate
