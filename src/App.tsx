import {BrowserRouter as Router, Navigate, Route, Routes} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import Login from "@/pages/login/Login.tsx";
import AccountSetting from "@/pages/account-setting/AccountSetting";
import NotFound from "@/pages/not-found/NotFound";
import {AuthProvider} from "@/context/AuthProvider";
import PrivateRoute from "@/components/PrivateRoute";
import ForgotPassword from "./pages/forgot-password/ForgotPassword";
import ConfirmOtp from "./pages/forgot-password/ConfirmOtp";
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
import BuildingDetail from "@/pages/building/BuildingDetail";
import FloorDetail from "@/pages/floor/FloorDetail";
import BuildingManagement from "@/pages/building/BuildingManagement";
import FloorManagement from "@/pages/floor/FloorManagement";

function App() {
    return (
        <Router>
            <QueryClientProvider client={queryClient}>
                <Provider store={store}>
                    <AuthProvider>
                        <Routes>
                            {/* Public routes */}
                            <Route path={ROUTES.LOGIN} element={<Login/>}/>
                            <Route path={ROUTES.LOGOUT} element={<Logout/>}/>
                            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPassword/>}/>
                            <Route path={ROUTES.CONFIRM_OTP} element={<ConfirmOtp/>}/>
                            <Route path={ROUTES.CHANGE_PASSWORD} element={<ChangePassword/>}/>
                            <Route path={ROUTES.SIGN_UP} element={<SignUp/>}/>

                            {/* Private routes */}
                            <Route element={<PrivateRoute/>}>
                                <Route element={<MainLayout/>}>
                                    <Route path="/" element={<Navigate to={ROUTES.DASHBOARD}/>}/>
                                    <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}/>

                                    {/* Buildings */}
                                    <Route path={ROUTES.BUILDINGS} element={<BuildingManagement/>}/>
                                    <Route path={ROUTES.BUILDING_DETAIL} element={<BuildingDetail/>}>
                                        <Route path="floors" element={<FloorManagement/>}/>
                                        <Route path="floors/:floorId" element={<FloorDetail/>}/>
                                    </Route>

                                    {/* Other routes */}
                                    <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting/>}/>
                                    <Route path={ROUTES.MODELS} element={<Model3D/>}/>
                                    <Route path={ROUTES.MODELS_CREATE} element={<Create3DModelPage/>}/>
                                    <Route path={ROUTES.MODELS_DETAIL} element={<ProductDetail/>}/>
                                </Route>
                            </Route>

                            {/* 404 */}
                            <Route path="*" element={<NotFound/>}/>
                        </Routes>
                    </AuthProvider>
                </Provider>
                <Toaster position="bottom-right" richColors closeButton={true}/>
                <ReactQueryDevtools initialIsOpen={false}/>
            </QueryClientProvider>
        </Router>
    );
}

export default App;
