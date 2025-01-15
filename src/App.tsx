import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {ROUTES} from "@/routes/routes";
import Login from "@/pages/login/Login.tsx";
import Home from "@/pages/home/Home.tsx";
import AccountSetting from "@/pages/account-setting/AccountSetting";
import NotFound from "@/pages/not-found/NotFound";
import {AuthProvider} from "@/context/AuthProvider";

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Define your routes */}
                    <Route path={ROUTES.HOME} element={<Home/>}/>
                    <Route path="/home" element={<Navigate to={ROUTES.HOME}/>}/>

                    <Route path={ROUTES.LOGIN} element={<Login/>}/>

                    <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting/>}/>

                    {/* Catch-all route for 404 */}
                    <Route path="*" element={<NotFound/>}/>
                </Routes>
            </Router>
        </AuthProvider>
    )
}

export default App
