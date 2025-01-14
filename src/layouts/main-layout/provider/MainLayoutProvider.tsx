import {createContext, ReactNode} from 'react';
import {useNavigate} from "react-router-dom";
import {ROUTES} from "@/utils/routes";

interface MainLayoutProviderProps {
    children: ReactNode;
}

interface MainLayoutContextProps {
    logout: () => void;
}

const MainLayoutContext = createContext<MainLayoutContextProps | undefined>(undefined);

const MainLayoutProvider = ({children}: MainLayoutProviderProps) => {
    const navigate = useNavigate();

    const logout = () => {
        navigate(ROUTES.LOGIN);
    }

    const value = {
        logout
    }

    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    );
};


export {MainLayoutProvider, MainLayoutContext};
