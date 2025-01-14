import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import {ROUTES} from "@/utils/routes";
import Login from "@/pages/login/Login.tsx";
import Home from "@/pages/home/Home.tsx";
import AccountSetting from "@/pages/account-setting/AccountSetting";
import NotFound from "@/pages/not-found/NotFound";

function App() {
    return (
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
    )
}

export default App
