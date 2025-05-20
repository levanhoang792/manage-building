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
import MainLayout from "./layouts/main-layout/MainLayout";
import {QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from '@tanstack/react-query-devtools';
import {queryClient} from "./utils/api";
import {Toaster} from "sonner";
import {Provider} from "react-redux";
import {store} from "@/store/store";
import Dashboard from "@/pages/dashboard/Dashboard";

// Building pages
import BuildingManagement from "@/pages/building/BuildingManagement";
import BuildingDetail from "@/pages/building/BuildingDetail";
import CreateBuilding from "@/pages/building/CreateBuilding";
import EditBuilding from "@/pages/building/EditBuilding";

// Floor pages
import {CreateFloor, EditFloor, FloorDetail, FloorManagement} from "@/pages/floor";

// Door pages
import {CreateDoor, DoorCoordinateManagement, DoorDetail, DoorManagement, EditDoor} from "@/pages/door";

// Door Type pages
import {DoorTypeManagement} from "@/pages/door-type";

// User management pages
import {CreateUser, EditUser, PendingUsers, UserManagement} from "@/pages/users";

// Role management pages
import {CreateRole, EditRole, RoleManagement, RolePermissions} from "@/pages/roles";

// Door Request pages
import {
    DoorRequestManagement,
    DoorRequestDetail,
    CreateDoorRequest,
    DoorLockManagement,
    CreateDoorLockRequest,
    GuestDoorRequest
} from "@/pages/door-request";

// Door Monitoring Dashboard
import DoorMonitoring from "@/pages/door-monitoring";

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
                            <Route path={ROUTES.GUEST_DOOR_REQUEST} element={<GuestDoorRequest/>}/>
                            <Route path={ROUTES.GUEST_DOOR_REQUEST_BUILDING} element={<GuestDoorRequest/>}/>
                            <Route path={ROUTES.GUEST_DOOR_REQUEST_BUILDING_FLOOR} element={<GuestDoorRequest/>}/>

                            {/* Private routes */}
                            <Route element={<PrivateRoute/>}>
                                <Route element={<MainLayout/>}>
                                    <Route path="/" element={<Navigate to={ROUTES.DASHBOARD}/>}/>
                                    <Route path={ROUTES.DASHBOARD} element={<Dashboard/>}/>

                                    {/* Other routes */}
                                    <Route path={ROUTES.ACCOUNT_SETTING} element={<AccountSetting/>}/>

                                    {/* Building routes */}
                                    <Route path={ROUTES.BUILDINGS} element={<BuildingManagement/>}/>
                                    <Route path={ROUTES.BUILDING_DETAIL} element={<BuildingDetail/>}/>
                                    <Route path={ROUTES.BUILDING_CREATE} element={<CreateBuilding/>}/>
                                    <Route path={ROUTES.BUILDING_EDIT} element={<EditBuilding/>}/>

                                    {/* Floor routes */}
                                    <Route path={ROUTES.BUILDING_FLOORS} element={<FloorManagement/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_DETAIL} element={<FloorDetail/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_CREATE} element={<CreateFloor/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_EDIT} element={<EditFloor/>}/>

                                    {/* Door routes */}
                                    <Route path={ROUTES.BUILDING_FLOOR_DOORS} element={<DoorManagement/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_DOOR_DETAIL} element={<DoorDetail/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_DOOR_CREATE} element={<CreateDoor/>}/>
                                    <Route path={ROUTES.BUILDING_FLOOR_DOOR_EDIT} element={<EditDoor/>}/>

                                    {/* Door Coordinate routes */}
                                    <Route path={ROUTES.BUILDING_FLOOR_DOOR_COORDINATES}
                                           element={<DoorCoordinateManagement/>}/>

                                    {/* Door Type routes */}
                                    <Route path={ROUTES.DOOR_TYPES} element={<DoorTypeManagement/>}/>

                                    {/* User management routes */}
                                    <Route path={ROUTES.USERS} element={<UserManagement/>}/>
                                    <Route path={ROUTES.USER_CREATE} element={<CreateUser/>}/>
                                    <Route path={ROUTES.USER_EDIT} element={<EditUser/>}/>
                                    <Route path={ROUTES.USER_PENDING} element={<PendingUsers/>}/>

                                    {/* Role management routes */}
                                    <Route path={ROUTES.ROLES} element={<RoleManagement/>}/>
                                    <Route path={ROUTES.ROLE_CREATE} element={<CreateRole/>}/>
                                    <Route path={ROUTES.ROLE_EDIT} element={<EditRole/>}/>
                                    <Route path={ROUTES.ROLE_PERMISSIONS} element={<RolePermissions/>}/>
                                    
                                    {/* Door Request routes */}
                                    <Route path={ROUTES.DOOR_REQUESTS} element={<DoorRequestManagement/>}/>
                                    <Route path={ROUTES.DOOR_REQUEST_DETAIL} element={<DoorRequestDetail/>}/>
                                    <Route path={ROUTES.DOOR_REQUEST_CREATE} element={<CreateDoorRequest/>}/>
                                    <Route path={ROUTES.DOOR_REQUEST_BUILDING_FLOOR_DOOR} element={<DoorRequestManagement/>}/>
                                    
                                    {/* Door Lock Management routes */}
                                    <Route path={ROUTES.DOOR_LOCK_MANAGEMENT} element={<DoorLockManagement/>}/>
                                    <Route path={ROUTES.DOOR_LOCK_BUILDING} element={<DoorLockManagement/>}/>
                                    <Route path={ROUTES.DOOR_LOCK_BUILDING_FLOOR} element={<DoorLockManagement/>}/>
                                    
                                    {/* Door Lock Request routes */}
                                    <Route path={ROUTES.DOOR_LOCK_REQUEST} element={<CreateDoorLockRequest/>}/>
                                    <Route path={ROUTES.DOOR_LOCK_REQUEST_BUILDING} element={<CreateDoorLockRequest/>}/>
                                    <Route path={ROUTES.DOOR_LOCK_REQUEST_BUILDING_FLOOR} element={<CreateDoorLockRequest/>}/>
                                    
                                    {/* Door Monitoring Dashboard */}
                                    <Route path={ROUTES.DOOR_MONITORING} element={<DoorMonitoring/>}/>
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
