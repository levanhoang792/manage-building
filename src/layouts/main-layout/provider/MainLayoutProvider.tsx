import React, {createContext, ReactNode, useState} from 'react';

interface MainLayoutProviderProps {
    children: ReactNode;
}

interface MainLayoutContextProps {
    // Define the context properties here
    exampleState: string;
    setExampleState: React.Dispatch<React.SetStateAction<string>>;
}

const MainLayoutContext = createContext<MainLayoutContextProps | undefined>(undefined);

const MainLayoutProvider = ({children}: MainLayoutProviderProps) => {
    const [exampleState, setExampleState] = useState<string>('default value');

    const value = {
        exampleState,
        setExampleState,
    }

    return (
        <MainLayoutContext.Provider value={value}>
            {children}
        </MainLayoutContext.Provider>
    );
};


export {MainLayoutProvider, MainLayoutContext};
