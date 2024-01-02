// Import necessary dependencies and modules
import { NavLink, useNavigate } from "react-router-dom";
import { auth } from "../../../firebase";

// Import helper functions and components
import { loginWithGoogle } from "./authHelpers";
import AuthForm from "./authForms";
import AuthContainer from "./authContainer";

// Import styling for the component
import "../../styles/auth.css";


/* Allows users to sign up with a new account.
 * Uses the AuthContainer component to manage authentication logic.
*/


const SignUp = () => {
    // useNavigate hook for navigation
    const navigate = useNavigate();


    return (
        <AuthContainer navigate={navigate} isSignUp={true}>
            {({ state, setState, submit }) => (
                <div className="container">
                    <div className="left">
                        <div className="sign_up">
                            Sign Up
                        </div>

                        <div className="eula">
                            <button className="google-signup-btn" onClick={() => loginWithGoogle(auth, navigate)}>
                                Login with Google
                            </button> 
                            <br></br>

                            <NavLink to="/sign-in">
                                <h3>Have account?</h3>
                            </NavLink> <h4>Go Sign In</h4>
                        </div>
                    </div>

                    <div className="right">
                        <div className="form">
                            <AuthForm
                                fields={[
                                    { label: "Display Name", type: "text", name: "displayName", value: state.displayName },
                                    { label: "Email", type: "email", name: "email", value: state.email },
                                    { label: "Password", type: "password", name: "password", value: state.password },
                                ]}
                                onChange={(name, value) => setState({ ...state, [name]: value })}
                                onSubmit={submit}
                            />
                         
                            {state.error && <div className="error">{state.error}</div>}
                        </div>
                    </div>
                </div>
            )}
        </AuthContainer>
    );
}


export default SignUp;