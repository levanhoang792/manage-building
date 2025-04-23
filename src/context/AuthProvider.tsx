import {createContext, ReactNode, useCallback} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useLogin} from "@/hooks/users/useUsers";
import {ReqLogin, ResLogin, ResLoginUser} from "@/hooks/users/model";
import Cookies from "js-cookie";
import {COOKIES} from "@/utils/cookies";
import {useDispatch} from "react-redux";
import {AppDispatch} from "@/store/store";
import {setUser} from "@/store/slices/authSlice";
import {UseMutationResult} from "@tanstack/react-query";
import {toast} from "sonner";

type CallbackLoginFuncProps = {
    onSuccess?: (res: ResLogin) => void
    onError?: (error: Error) => void
}

interface AuthContextType {
    loginMutation: UseMutationResult<ResLogin, Error, ReqLogin, unknown>,
    token?: string;

    login: (data: ReqLogin) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();

    const loginMutation = useLogin();

    const dispatch = useDispatch<AppDispatch>();

    const initializeToken = useCallback((user: ResLoginUser, token: string) => {
        dispatch(setUser({
            token: token,
            user: user
        }));
        Cookies.set(COOKIES.TOKEN, token);
    }, [dispatch]);

    const clearToken = useCallback(() => {
        dispatch(setUser(null));
        Cookies.remove(COOKIES.TOKEN);
    }, [dispatch]);

    const login = useCallback((data: ReqLogin, callbacks?: CallbackLoginFuncProps) => {
        // console.log("------> Line: 46 | AuthProvider.tsx callbacks: ", callbacks);
        // initializeToken({
        //         email: data.email,
        //         username: "1",
        //         name: "",
        //     }, "res.token"
        // );
        // navigate(ROUTES.HOME);
        loginMutation.mutate(data, {
            onSuccess: (res) => {
                if (res.token) {
                    initializeToken(res.user, res.token);
                    navigate(ROUTES.HOME);

                    callbacks?.onSuccess?.(res);
                } else {
                    toast.error("Login failed");
                }
            },
            onError: (error) => {
                console.error(error);

                callbacks?.onError?.(error);
            }
        })
    }, [initializeToken, loginMutation, navigate]);

    const logout = useCallback(() => {
        clearToken();
        navigate(ROUTES.LOGIN);
    }, [clearToken, navigate]);

    const value: AuthContextType = {
        // variable
        loginMutation,

        // function
        login,
        logout
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export {AuthProvider, AuthContext};