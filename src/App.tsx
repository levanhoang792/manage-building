import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {ROUTES} from "@/routes/routes";
import Login from "@/pages/login/Login.tsx";
import Home from "@/pages/home/Home.tsx";
import AccountSetting from "@/pages/account-setting/AccountSetting";
import NotFound from "@/pages/not-found/NotFound";
import {AuthProvider} from "@/context/AuthProvider";
import {ToastContainer} from "react-toastify";
import PrivateRoute from "@/components/PrivateRoute";
import ForgotPassword from './pages/forgot-password/ForgotPassword';
import ConfrimOtp from './pages/forgot-password/ConfirmOtp';
import ChangePassword from './pages/forgot-password/ChangePassword';
import SignUp from './pages/sign-up/SignUp';
import Logout from "@/pages/logout/Logout";

function App() {
    return (
        <Router>
            <AuthProvider>
                <Routes>
                    {/* Define your public routes */}
                    <Route path={ROUTES.LOGIN} element={<Login/>}/>
                    <Route path={ROUTES.LOGOUT} element={<Logout/>}/>
                    <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                    <Route path={ROUTES.CONFIRM_OTP} element={<ConfrimOtp/>}/>
                    <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword/>}/>

                    <Route path={ROUTES.SIGN_UP} element={<SignUp/>}/>

                    {/* Define your private routes */}
                    <Route element={<PrivateRoute/>}>
                        <Route path={ROUTES.HOME} element={<Home/>}/>
                        <Route path="/home" element={<Navigate to={ROUTES.HOME}/>}/>

                        <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting/>}/>
                    </Route>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </AuthProvider>

            <ToastContainer stacked position="bottom-left" autoClose={8000}/>
        </Router>
    )
}

export default App
