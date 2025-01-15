import {createContext, ReactNode, useEffect, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
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
    const location = useLocation();
    const navigate = useNavigate();

    const [token, setToken] = useState<string | undefined>(localStorage.getItem(LOCAL_STORAGE_KEY.TOKEN) || undefined);

    const login = (data: LoginFormData) => {
        console.log(data);

        const token = "token";

        setToken(token);
        localStorage.setItem(LOCAL_STORAGE_KEY.TOKEN, token);
        navigate(ROUTES.HOME);
    };

    const logout = () => {
        if (location.pathname !== ROUTES.LOGIN) {
            localStorage.removeItem(LOCAL_STORAGE_KEY.TOKEN);
            navigate(ROUTES.LOGIN);
        }
    }

    useEffect(() => {
        if (!token) {
            logout();
        } else if (location.pathname === ROUTES.LOGIN) {
            navigate(ROUTES.HOME);
        }
    }, []);

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