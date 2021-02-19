import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from 'firebaseInstance';
import Tweet from 'components/Tweet';
const Profile = ({ user }) => {
    const history = useHistory();
    const [myTweets, setMyTweets] = useState([]);
    const getMyTweets = useCallback(async () => {
        const fetchedTweets = [];
        const querySnapshot = await db
            .collection('tweets')
            .where('userId', '==', user.uid)
            // .orderBy('createdAt')
            .get();
        querySnapshot.forEach((doc) => {
            fetchedTweets.push({ id: doc.id, ...doc.data() });
        });
        setMyTweets(fetchedTweets);
    }, [user.uid]);
    const logoutHandler = useCallback(async () => {
        await auth.signOut();
        history.replace('/');
    }, [history]);

    useEffect(() => {
        getMyTweets();
    }, [getMyTweets]);

    return (
        <>
            <div>
                Profile
                <button onClick={logoutHandler}>logout</button>
            </div>
            <div>
                {myTweets.map((tweet) => (
                    <Tweet key={tweet.id} tweet={tweet} isMine={true} />
                ))}
            </div>
        </>
    );
};

export default Profile;
