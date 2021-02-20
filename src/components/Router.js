import React from 'react';
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';
const Router = ({ isLoggedIn, user, refreshUser }) => {
    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation user={user}/>}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route path="/" exact>
                            <Home user={user} />
                        </Route>
                        <Route path="/profile" exact>
                            <Profile user={user} refreshUser={refreshUser}/>
                        </Route>
                    </>
                ) : (
                    <>
                        <Route path="/" exact component={Auth} />
                    </>
                )}
                <Redirect from="*" to="/" />
            </Switch>
        </BrowserRouter>
    );
};

export default Router;
