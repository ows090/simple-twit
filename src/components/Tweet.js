import React, { useCallback, useState } from 'react';
import { db, storage } from 'firebaseInstance';
const Tweet = ({ tweet, isMine }) => {
    const [editMode, setEditMode] = useState(false);
    const [editContent, setEditContent] = useState('');

    const onDelete = useCallback(async () => {
        try {
            const confirmResult = window.confirm('are you sure?');
            if (!confirmResult) return;
            await db.collection('tweets').doc(tweet.id).delete();
            await storage.refFromURL(tweet.imgUrl).delete();
        } catch (error) {
            console.error(error);
        }
    }, []);

    const onToggleEditMode = useCallback(() => {
        setEditMode((prev) => !prev);
    }, []);

    const onChangeEditContent = useCallback((e) => {
        setEditContent(e.target.value);
    }, []);

    const onSubmitEditContent = useCallback(
        async (e) => {
            e.preventDefault();
            const targetDocRef = db.collection('tweets').doc(tweet.id);
            try {
                await targetDocRef.update({
                    content: editContent,
                });
                setEditContent('');
                setEditMode(false);
            } catch (error) {
                console.log(error);
            }
        },
        [editContent, tweet.id]
    );
    return (
        <div
            style={{
                borderBottom: '3px solid black',
                padding: '1rem',
                margin: '0.5rem',
            }}
        >
            <h3>{tweet.content}</h3>
            {tweet.imgUrl && (
                <div
                    style={{
                        backgroundImage: `url(${tweet.imgUrl})`,
                        backgroundPosition: 'center',
                        backgroundSize: 'cover',
                        width: '300px',
                        height: '300px',
                    }}
                ></div>
            )}
            <div>{tweet.userId}</div>
            {isMine && <button onClick={onDelete}>DELETE</button>}
            {isMine && !editMode && (
                <button onClick={onToggleEditMode}>EDIT</button>
            )}
            {editMode && (
                <form onSubmit={onSubmitEditContent}>
                    <textarea
                        value={editContent}
                        onChange={onChangeEditContent}
                    />
                    <div>
                        <button type="submit">EDIT</button>
                        <button onClick={onToggleEditMode}>CANCEL</button>
                    </div>
                </form>
            )}
        </div>
    );
};

export default Tweet;
