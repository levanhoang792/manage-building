import {Outlet, useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppDispatch, RootState} from "@/store/store";
import Cookies from "js-cookie";
import {COOKIES} from "@/utils/cookies";
import {useCheckExpireToken} from "@/hooks/users/useUsers";
import {API_RESPONSE_CODE} from "@/routes/api";
import {logout, setUser} from "@/store/slices/authSlice";

const PrivateRoute = () => {
    const navigate = useNavigate();

    const dispatch = useDispatch<AppDispatch>();
    const user = useSelector((state: RootState) => state.auth.user);

    const checkExpireMutation = useCheckExpireToken();
    const {mutate: checkExpireToken} = checkExpireMutation;

    useEffect(() => {
        const handleLogout = () => {
            Cookies.remove(COOKIES.TOKEN);
            dispatch(logout());
            if (window.location.pathname !== ROUTES.LOGIN) {
                navigate(ROUTES.LOGIN, {replace: true});
            }
        }

        const token = Cookies.get(COOKIES.TOKEN);
        if (token) {
            if (!user?.token) {
                checkExpireToken(undefined, {
                    onSuccess: (res) => {
                        const {r, data} = res;

                        if (r === API_RESPONSE_CODE.SUCCESS) {
                            dispatch(setUser({
                                token: data.token,
                                user: data.user
                            }));
                        } else {
                            handleLogout();
                        }
                    },
                    onError: (e) => {
                        console.error("Check expire token error", e);
                    }
                })
            }
        } else if (window.location.pathname !== ROUTES.LOGIN) {
            navigate(ROUTES.LOGIN, {replace: true});
        }
    }, [user?.token, navigate, dispatch]);

    return <Outlet/>;
};

export default PrivateRoute;
