import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';

import './styles/home.css';


const LoadedHome = () => {
    let [isAuth, setIsAuth] = useState(false);
    
    useEffect(() => {
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsAuth(true);
            } 
        })
    })


    return (
        <div className="block">
            {isAuth ? (
                <h1>Chats</h1>
            ) : (
                <div className="block-content">
                    <h2>Not allowed page</h2>
                    <h2 className="info">Please authenticate to access the content</h2>
                    <a className="info" href="/sign-up">Sign up</a>
                </div>
            )}
        </div>
    );
}


export default LoadedHome;