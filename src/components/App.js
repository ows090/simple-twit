import React, { useEffect, useState } from 'react';
import Router from './Router';
import { auth } from 'firebaseInstance';

const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState(null);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                //logined case
                console.log(user);
                setUser(user);
            } else {
                //logout case
                setUser(null);
            }
            return setIsInitialized(true);
        });
    }, []);
    return (
        <>
            {isInitialized ? (
                <>
                    <Router isLoggedIn={Boolean(user)} user={user} />
                    <footer>
                        &copy; Simple Twit {new Date().getFullYear()}
                    </footer>{' '}
                </>
            ) : (
                <div>loading...</div>
            )}
        </>
    );
};

export default App;
