import {useAuth} from "@/hooks/useAuth";
import {Outlet, useLocation, useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";

const PrivateRoute = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const {token} = useAuth();

    if (!token) {
        if (location.pathname !== ROUTES.LOGIN) navigate(ROUTES.LOGIN);
    } else if (location.pathname === ROUTES.LOGIN) {
        navigate(ROUTES.HOME);
    }

    return <Outlet/>;
};

export default PrivateRoute;
