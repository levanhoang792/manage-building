import {useAuth} from "@/hooks/useAuth";
import {Navigate, Outlet} from "react-router-dom";

const PrivateRoute = () => {
    const {token} = useAuth();
    if (!token) return <Navigate to="/login"/>;
    return <Outlet/>;
};

export default PrivateRoute;
