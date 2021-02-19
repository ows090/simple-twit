import React from 'react';
import { Redirect, BrowserRouter, Switch, Route } from 'react-router-dom';
import Auth from 'routes/Auth';
import Home from 'routes/Home';
import Profile from 'routes/Profile';
import Navigation from 'components/Navigation';
const Router = ({ isLoggedIn , user}) => {
    return (
        <BrowserRouter>
            {isLoggedIn && <Navigation />}
            <Switch>
                {isLoggedIn ? (
                    <>
                        <Route path="/" exact>
                            <Home user={user}/>
                        </Route>
                        <Route path="/profile" exact component={Profile} />
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
