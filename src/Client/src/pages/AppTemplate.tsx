import React from 'react'
import { Switch, Route } from 'react-router-dom'
import { LoginPage } from './LoginPage'
import { RegisterPage } from './RegisterPage'
import { ChatPage } from './ChatPage'
import { UserFrofilePage } from './UserProfilePage'

const AppTemplate = () => {
    return (
        <Switch>
            <Route exact path='/login' component={LoginPage} />
            <Route exact path='/register' component={RegisterPage} />
            <Route exact path='/profile/:id' component={UserFrofilePage} />
            <Route exact path='/chat/*' component={ChatPage} />
            {/* <Route exact path='*' component={} /> */}
        </Switch>
    )
}

export default AppTemplate
