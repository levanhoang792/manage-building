import {BrowserRouter as Router, Route, Routes} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import Login from "@/pages/login/Login.tsx";
import AccountSetting from "@/pages/account-setting/AccountSetting";
import NotFound from "@/pages/not-found/NotFound";
import {AuthProvider} from "@/context/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ConfrimOtp from "./pages/forgot-password/ConfirmOtp";
import ChangePassword from "./pages/forgot-password/ChangePassword";
import SignUp from "./pages/sign-up/SignUp";
import Logout from "@/pages/logout/Logout";
import Model3D from "./pages/models/page";
import MainLayout from "./layouts/main-layout/MainLayout";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {queryClient} from "./utils/api";
import Create3DModelPage from "./pages/models/create/page";
import {Toaster} from "sonner";
import ProductDetail from "@/pages/models/detail/page";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import Dashboard from "@/pages/dashboard/Dashboard";

function App() {
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
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
                                <Route element={<MainLayout/>}>
                                    {/*<Route path={ROUTES.HOME} element={<Home/>}/>*/}
                                    {/*<Route path="/home" element={<Navigate to={ROUTES.HOME}/>}/>*/}
                                    <Route path={ROUTES.HOME} element={<Dashboard/>}/>

                                    <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting/>}/>
                                    <Route path={ROUTES.MODELS} element={<Model3D/>}/>
                                    <Route path={ROUTES.MODELS_CREATE} element={<Create3DModelPage/>}/>
                                    <Route path={ROUTES.MODELS_DETAIL} element={<ProductDetail/>}/>
                                </Route>
                            </Route>

                            {/* Catch-all route for 404 */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </AuthProvider>
                </Provider>

                <Toaster position="bottom-right" richColors closeButton={true}/>

                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </Router>
    )
        ;
}

export default App;
