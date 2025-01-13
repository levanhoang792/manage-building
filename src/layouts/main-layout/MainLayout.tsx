import Headers from "@/layouts/main-layout/components/Headers.tsx";
import LeftToolbar from "@/layouts/main-layout/components/LeftToolbar.tsx";
import Footer from "@/layouts/main-layout/components/Footer.tsx";
import {cn} from "@/lib/utils.ts";
import {MainLayoutProvider} from "@/layouts/main-layout/provider/MainLayoutProvider.tsx";
import {ReactNode} from "react";

function MainLayout({children}: { children: ReactNode }) {
    return (
        <MainLayoutProvider>
            <Headers/>

            <LeftToolbar/>

            <div id="main-content" className={cn("")}>
                {children}
            </div>

            <Footer/>
        </MainLayoutProvider>
    );
}

export default MainLayout;