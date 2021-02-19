import React, { useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from 'firebaseInstance';
const Profile = () => {
    const history = useHistory();
    const logoutHandler = useCallback(async () => {
        await auth.signOut();
        history.replace('/');
    }, [history]);
    return (
        <div>
            Profile
            <button onClick={logoutHandler}>logout</button>
        </div>
    );
};

export default Profile;
