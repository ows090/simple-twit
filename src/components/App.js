import React, { useCallback, useEffect, useState } from 'react';
import Router from './Router';
import { auth } from 'firebaseInstance';

const App = () => {
    const [isInitialized, setIsInitialized] = useState(false);
    const [user, setUser] = useState(null);
    const refreshUser = useCallback(() => {
        const user = auth.currentUser;
        setUser({
            displayName: user.displayName,
            uid: user.uid,
            photoURL: user.photoURL,
            updateProfile: (args) => user.updateProfile(args),
        });
    }, []);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                //logined case
                setUser({
                    displayName: user.displayName,
                    uid: user.uid,
                    photoURL: user.photoURL,
                    updateProfile: (args) => user.updateProfile(args),
                });
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
                    <Router
                        isLoggedIn={Boolean(user)}
                        user={user}
                        refreshUser={refreshUser}
                    />
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
