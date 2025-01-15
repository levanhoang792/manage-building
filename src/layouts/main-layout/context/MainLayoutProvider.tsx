import {createContext, ReactNode} from 'react';

interface MainLayoutProviderProps {
    children: ReactNode;
}

interface MainLayoutContextType {
    example: string;
}

const MainLayoutContext = createContext<MainLayoutContextType | undefined>(undefined);

const MainLayoutProvider = ({children}: MainLayoutProviderProps) => {
    const value = {
        example: 'example'
    };

    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    );
};


export {MainLayoutProvider, MainLayoutContext};
