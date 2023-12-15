import { NavLink } from "react-router-dom";


const SignIn = () => {
    return (
        <>
            <div className="container">
                <div className="left">
                <div className="sign_in">
                    Sign In
                </div>

                <div class="eula">
                    <button className="google-signup-btn">Login with Google</button> <br></br>

                    <NavLink to="/sign-up">
                        <h3>Not have account?</h3>
                    </NavLink> <h4>Go Sign Up</h4>
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
                        <label for="email">Email</label>
                        <input 
                            type="email" 
                            id="email"
                        />

                        <label for="password">Password</label>
                        <input 
                            type="password" 
                            id="password"
                        />

                        <input type="submit" id="submit" value="Submit"/>
                    </div>
                </div>
            </div>
        </>
    );
}


export default SignIn;