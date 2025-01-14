import Headers from "@/layouts/main-layout/components/Headers.tsx";
import LeftToolbar from "@/layouts/main-layout/components/LeftToolbar.tsx";
import Footer from "@/layouts/main-layout/components/Footer.tsx";
import {cn} from "@/lib/utils.ts";
import {MainLayoutProvider} from "@/layouts/main-layout/provider/MainLayoutProvider.tsx";
import {ReactNode} from "react";
import {ToastContainer} from "react-toastify";

type MainLayoutProps = {
    children: ReactNode
    className?: string
}

function MainLayout({children, className}: MainLayoutProps) {
    return (
        <MainLayoutProvider>
            <Headers/>

            <LeftToolbar/>

            <div id="main-content"
                 className={cn(
                     "overflow-auto pt-2 pl-2",
                     "max-h-dvh h-[calc(100dvh-var(--header-height))] mt-[var(--header-height)]",
                     "max-w-full h-[calc(100%-var(--left-toolbar-width))] ml-[var(--left-toolbar-width)]",
                     className || ""
                 )}
            >
                {children}
            </div>

            <Footer/>

            <ToastContainer stacked position="bottom-left" autoClose={8000}/>
        </MainLayoutProvider>
    );
}

export default MainLayout;