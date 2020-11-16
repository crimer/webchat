import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import LoginPage from './LoginPage'
import RegisterPage from './RegisterPage'
import ChatPage from './ChatPage'

const AppTemplate = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path='/login' component={LoginPage} />
                <Route exact path='/register' component={RegisterPage} />
                <Route exact path='/' component={ChatPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default AppTemplate
