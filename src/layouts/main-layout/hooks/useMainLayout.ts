import {useContext} from "react";
import {MainLayoutContext} from "@/layouts/main-layout/context/MainLayoutProvider.tsx";

const useMainLayout = () => {
    const context = useContext(MainLayoutContext);
    if (context === undefined) {
        throw new Error('useMainLayoutContext must be used within a MainLayoutProvider');
    }
    return context;
};

export default useMainLayout;