import { createBrowserRouter, Route, createRoutesFromElements, Navigate } from "react-router-dom";


// pages
import LoadedHome from "../pages/Home";
import Page404 from "../pages/Page404";

// layouts
import RootLayout from "../layouts/RootLayout";


const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={ <RootLayout/> }>
            <Route index element={ <LoadedHome />} />
            <Route path="404" element={ <Page404 /> } />
            <Route path="*" element={ <Navigate to="404" replace /> }/>

   
        </Route>
    )
)


export default router;