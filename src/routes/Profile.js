import React, { useCallback, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { auth, db } from 'firebaseInstance';
import Tweet from 'components/Tweet';
const Profile = ({ user, refreshUser }) => {
    const history = useHistory();
    const [myTweets, setMyTweets] = useState([]);
    const [newDisplayName, setNewDisplayName] = useState(user.displayName);
    const onChangeDisplayName = useCallback((e) => {
        setNewDisplayName(e.target.value);
    }, []);

    const onSubmitDisplayName = useCallback(
        async (e) => {
            e.preventDefault();
            if (newDisplayName === user.displayName) return;
            try {
                await user.updateProfile({
                    displayName: newDisplayName,
                });
                refreshUser();
            } catch (error) {
                console.error(error);
            }
        },
        [newDisplayName, user, refreshUser]
    );

    const getMyTweets = useCallback(async () => {
        const fetchedTweets = [];
        const querySnapshot = await db
            .collection('tweets')
            .where('userId', '==', user.uid)
            .orderBy('createdAt', 'desc')
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
                <div>
                    <img
                        style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                        }}
                        src={user.photoURL}
                        alt="profile img"
                    />
                </div>
                <button onClick={logoutHandler}>logout</button>
            </div>
            <form onSubmit={onSubmitDisplayName}>
                <input
                    type="text"
                    value={newDisplayName}
                    onChange={onChangeDisplayName}
                />
                <button type="submit">change</button>
            </form>
            <div>
                {myTweets.map((tweet) => (
                    <Tweet key={tweet.id} tweet={tweet} isMine={true} />
                ))}
            </div>
        </>
    );
};

export default Profile;
