import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";

import "../styles/auth.css";


const SignUp = () => {
    // data user
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    // useNavigate hook
    const navigate = useNavigate();

    // request
    const submit = async (e) => {
        e.preventDefault();

        try {
            await axios.post("/sign-up", {
                email: email,
                password: password
            })

            navigate("/sign-in");
        } catch (e) {
            console.log(`Error sign up: ${e}`)
        }
    }

    return (
        <div className="container">
            <div className="left">
                <div className="sign_up">
                    Sign Up
                </div >

                <div class="eula">
                    <button className="google-signup-btn">Login with Google</button> <br></br>

                    <NavLink to="/sign-in">
                        <h3>Have account?</h3>
                    </NavLink> <h4>Go Sign In</h4>
                </div>
            </div>

            <div className="right">
                <svg viewBox="0 0 320 300">
                    <defs>
                        <linearGradient
                            id="linearGradient"
                            x1="13"
                            y1="193.49992"
                            x2="307"
                            y2="193.49992"
                            gradientUnits="userSpaceOnUse"
                            >
                            <stop style={{ stopColor: '#ff00ff' }} offset="0" id="stop876" />
                            <stop style={{ stopColor: '#ff0000' }} offset="1" id="stop878" />
                        </linearGradient>
                    </defs>
                    <path d="m 40,120.00016 239.99984,-3.2e-4 c 0,0 24.99263,0.79932 25.00016,35.00016 0.008,34.20084 -25.00016,35 -25.00016,35 h -239.99984 c 0,-0.0205 -25,4.01348 -25,38.5 0,34.48652 25,38.5 25,38.5 h 215 c 0,0 20,-0.99604 20,-25 0,-24.00396 -20,-25 -20,-25 h -190 c 0,0 -20,1.71033 -20,25 0,24.00396 20,25 20,25 h 168.57143" />
                </svg>
                <div className="form">
                    <form onSubmit={submit}>
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <input type="submit" id="submit" value="Submit" onClick={submit}/>
                    </form>
                </div>
            </div>
        </div>
    );
}


export default SignUp;