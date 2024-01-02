// Import necessary dependencies and modules
import { NavLink, useNavigate } from "react-router-dom";

// Import helper functions and components
import AuthContainer from "./authContainer";
import AuthForm from "./authForms";
import { loginWithGoogle } from "./authHelpers";
import { auth } from "../../../firebase";

/**
 * Allows users to sign in with an existing account.
 * Uses the AuthContainer component to manage authentication logic.
*/


const SignIn = () => {
    // useNavigate hook for navigation
    const navigate = useNavigate();


    return (
        <AuthContainer navigate={navigate}>
            {({ state, setState, submit }) => (
                <div className="container">
                    <div className="left">
                        <div className="sign_in">
                            Sign In
                        </div>

                        <div className="eula">
                            <button className="google-signup-btn" onClick={() => loginWithGoogle(auth, navigate)}>
                                Login with Google
                            </button> 
                            <br></br>

                            <NavLink to="/sign-up">
                                <h3>Not have account?</h3>
                            </NavLink> <h4>Go Sign Up</h4>
                        </div>
                    </div>
                    <div className="right">
                        <div className="form">
                            <AuthForm
                                fields={[
                                    { label: "Email", type: "email", name: "email", value: state.email },
                                    { label: "Password", type: "password", name: "password", value: state.password },
                                ]}
                                onChange={(name, value) => setState({ ...state, [name]: value })}
                                onSubmit={submit}
                            />
                     
                            <h2>{state.error}</h2>
                        </div>
                    </div>
                </div>
            )}
        </AuthContainer>
    );
}


// Export the SignIn component
export default SignIn;