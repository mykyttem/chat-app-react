import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { useEffect, useState } from 'react';

// styles
import './styles/home.scss';
import './styles/side_bar.scss';
import './styles/profile.scss';
import './styles/panel_chat.scss';
import './styles/chat.scss';

// components
import SideBar from './components/SideBar';
import Chat from './components/Chat';
import Profile from './components/Profile';
import PanelChat from './components/panel_chat';


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
        <>
            {isAuth ? (
                <div className="home-container">
                    <SideBar />
                    <Profile />
                    <PanelChat />
                    <Chat />
                </div>
            ) : (
                <div className="block-not-auth">
                    <div className="block-not-auth-content">
                        <h2>Not allowed page</h2>
                        <h2 className="info-not-auth">Please authenticate to access the content</h2>
                        <a className="info-not-auth" href="/sign-up">Sign up</a>
                    </div>
                </div>
            )}
        </>
    );
}


export default LoadedHome;