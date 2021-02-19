import React, { useCallback, useState } from 'react';
import firebaseInstance, { auth } from 'firebaseInstance';
const Auth = () => {
    const [newAccount, setNewAccount] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const onChange = useCallback((e) => {
        const {
            target: { name, value },
        } = e;
        if (name === 'email') return setEmail(value);
        if (name === 'password') return setPassword(value);
    }, []);

    const onSubmit = useCallback(
        async (e) => {
            e.preventDefault();
            try {
                let result;
                if (newAccount) {
                    result = await auth.createUserWithEmailAndPassword(
                        email,
                        password
                    );
                } else {
                    result = await auth.signInWithEmailAndPassword(
                        email,
                        password
                    );
                }
                console.log('login success message: ', result);
            } catch (error) {
                console.error(error);
                setError(error.message);
            }
        },
        [email, password, newAccount]
    );

    const onToggle = useCallback(() => {
        setNewAccount((prev) => !prev);
    }, []);

    const onSocialLogin = useCallback(async (e) => {
        const { name } = e.target;
        let provider;
        switch (name) {
            case 'google':
                provider = new firebaseInstance.auth.GoogleAuthProvider();
                break;
            case 'github':
                provider = new firebaseInstance.auth.GithubAuthProvider();
                break;
            default:
                break;
        }
        try {
            const result = await auth.signInWithPopup(provider);
            //this gives you a github access token
            console.log('social login success');
            console.log('accessToken:', result.credential.accessToken);
            console.log('user: ', result.user);
        } catch (error) {
            console.error(error);
            setError(error.message);
        }
    }, []);

    return (
        <div>
            <span onClick={onToggle} style={{ cursor: 'pointer' }}>
                {newAccount ? 'I want to login' : 'I want to sign in'}
            </span>
            <form onSubmit={onSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    required
                    value={email}
                    name="email"
                    onChange={onChange}
                />
                <input
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                    onChange={onChange}
                />
                <button type="submit">
                    {newAccount ? 'Sign Up' : 'Log In'}
                </button>
            </form>
            <div>
                <button name="google" onClick={onSocialLogin}>
                    Continue with Google
                </button>
                <button name="github" onClick={onSocialLogin}>
                    Continue with Github
                </button>
            </div>
            {error && (
                <div class="error-message" style={{ border: '1px solid red' }}>
                    {error}
                </div>
            )}
        </div>
    );
};

export default Auth;
