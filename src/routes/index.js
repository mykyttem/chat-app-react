import { createBrowserRouter, Route, createRoutesFromElements, Navigate } from "react-router-dom";

// layouts
import RootLayout from "../layouts/RootLayout";

// pages
import LoadedHome from "../pages/Home";
import Page404 from "../pages/Page404";

import SignUp from "../pages/controllers/auth/sign_up";
import SignIn from "../pages/controllers/auth/sign_in";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <RootLayout/> }>
            <Route index element={ <LoadedHome />} />
            <Route path="404" element={ <Page404 /> } />
            <Route path="*" element={ <Navigate to="404" replace /> }/>

            <Route path="sign-up" element={ <SignUp /> } />
            <Route path="sign-in" element={ <SignIn /> } />

            <Route path="/chat/:chatId" element={<LoadedHome />} />
        </Route>
    )
)


export default router;