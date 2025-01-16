import {createContext, ReactNode, useCallback, useState} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {LoginFormData} from "@/types/login";
import {LOCAL_STORAGE_KEY} from "@/utils/localStorage";

interface AuthContextType {
    token?: string;
    login: (data: LoginFormData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const navigate = useNavigate();

    const [token, setToken] = useState<string | undefined>(localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN) || undefined);

    const initializeToken = useCallback((token: string) => {
        setToken(token);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
    }, []);

    const clearToken = useCallback(() => {
        setToken(undefined);
        localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
    }, []);

    const login = useCallback((data: LoginFormData) => {
        console.log(data);

        const token = "token";

        initializeToken(token);
        navigate(ROUTES.HOME);
    }, [initializeToken, navigate]);

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