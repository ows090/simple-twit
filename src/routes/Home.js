import React, { useCallback, useEffect, useState } from 'react';
import { db, storage } from 'firebaseInstance';
import Tweet from '../components/Tweet';
import { v4 as uuid4 } from 'uuid';
const Home = ({ user }) => {
    const [tweet, setTweet] = useState('');
    const [tweets, setTweets] = useState([]);
    const [imgDataUrl, setImgDataUrl] = useState(null);

    const onClearImage = useCallback(() => {
        setImgDataUrl(null);
    }, [setImgDataUrl]);
    const onChange = useCallback((e) => {
        const { name, value } = e.target;
        if (name === 'tweet') {
            setTweet(value);
        }
    }, []);

    const onFileChange = useCallback((e) => {
        const files = e.target.files;
        if (files.length > 1)
            return alert('you cannot upload file greater than 1');
        const targetFile = files[0];
        const reader = new FileReader();
        reader.onloadend = (finishedEvent) => {
            setImgDataUrl(finishedEvent.target.result);
        };
        reader.readAsDataURL(targetFile);
    }, []);

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            let imgUrl;
            try {
                if (imgDataUrl) {
                    const fileRef = storage
                        .ref()
                        .child(`${user.uid}/${uuid4()}`);
                    const uploadTaskSnapshot = await fileRef.putString(
                        imgDataUrl,
                        'data_url'
                    );
                    imgUrl = await uploadTaskSnapshot.ref.getDownloadURL();
                }
                await db.collection('tweets').add({
                    content: tweet,
                    createdAt: Date.now(),
                    imgUrl,
                    userId: user.uid,
                });
                setTweet('');
                setImgDataUrl(null);
            } catch (error) {
                console.error(error);
            }
        },
        [tweet, imgDataUrl, user.uid]
    );
    useEffect(() => {
        db.collection('tweets').onSnapshot((querySnapshot) => {
            const tweetsArr = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data(),
            }));
            setTweets(
                tweetsArr.sort(
                    (a, b) => parseInt(b.createdAt) - parseInt(a.createdAt)
                )
            );
        });
    }, []);

    return (
        <>
            <form onSubmit={onSubmit}>
                <div>
                    <input
                        type="text"
                        name="tweet"
                        value={tweet}
                        onChange={onChange}
                        placeholder="what's on your mind"
                    />
                </div>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={onFileChange}
                    />
                    <div>
                        {imgDataUrl && (
                            <div
                                style={{
                                    backgroundImage: `url(${imgDataUrl})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    width: '300px',
                                    height: '300px',
                                    position: 'relative',
                                }}
                            >
                                <button
                                    style={{
                                        position: 'absolute',
                                        top: '1px',
                                        right: '1px',
                                        cursor: 'pointer',
                                    }}
                                    onClick={onClearImage}
                                >
                                    X
                                </button>
                            </div>
                        )}
                    </div>
                </div>
                <button type="submit">tweet</button>
            </form>
            <div>
                {tweets &&
                    tweets.map((tweet) => (
                        <Tweet
                            key={tweet.id}
                            tweet={tweet}
                            isMine={user.uid === tweet.userId}
                        />
                    ))}
            </div>
        </>
    );
};

export default Home;
