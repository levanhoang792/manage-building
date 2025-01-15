import {createContext, ReactNode} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {LoginFormData} from "@/types/login";

interface AuthContextType {
    login: (data: LoginFormData) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({children}: { children: ReactNode }) => {
    const login = (data: LoginFormData) => {
        console.log(data);
        navigate(ROUTES.HOME);
    };

    const navigate = useNavigate();

    const logout = () => {
        navigate(ROUTES.LOGIN);
    }

    const value: AuthContextType = {
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