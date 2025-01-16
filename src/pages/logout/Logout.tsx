import {useAuth} from "@/hooks/useAuth";
import {useEffect} from "react";
import {ROUTES} from "@/routes/routes";
import {Navigate} from "react-router-dom";

function Logout() {
    const {logout} = useAuth();

    useEffect(() => {
        logout();
    }, [logout]);

    return <Navigate to={ROUTES.LOGIN}/>;
}

export default Logout;