import {createContext, ReactNode, useCallback, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useLogin} from "@/hooks/users/useUsers";
import {ReqLogin, ResLogin} from "@/hooks/users/model";
import Cookies from "js-cookie";
import {COOKIES} from "@/utils/cookies";

type CallbackLoginFuncProps = {
    onSuccess?: (res: ResLogin) => void
    onError?: (error: Error) => void
}

interface AuthContextType {
    token?: string;
    login: (data: ReqLogin) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();

    const loginMutation = useLogin();

    const [token, setToken] = useState<string | undefined>(Cookies.get(COOKIES.TOKEN) || undefined);

    const initializeToken = useCallback((token: string) => {
        setToken(token);
        Cookies.set(COOKIES.TOKEN, token);
    }, []);

    const clearToken = useCallback(() => {
        setToken(undefined);
        Cookies.remove(COOKIES.TOKEN);
    }, []);

    const login = useCallback((data: ReqLogin, callbacks?: CallbackLoginFuncProps) => {
        loginMutation.mutate(data, {
            onSuccess: (res) => {
                initializeToken(res.token);
                navigate(ROUTES.HOME);

                callbacks?.onSuccess?.(res);
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
        token,

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