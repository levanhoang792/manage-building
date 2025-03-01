import Headers from "@/layouts/main-layout/components/Headers.tsx";
import LeftToolbar from "@/layouts/main-layout/components/LeftToolbar.tsx";
import Footer from "@/layouts/main-layout/components/Footer.tsx";
import {cn} from "@/lib/utils.ts";
import {MainLayoutProvider} from "@/layouts/main-layout/context/MainLayoutProvider";
import {Outlet} from "react-router-dom";

function MainLayout() {
    return (
        <MainLayoutProvider>
            <Headers />

            <LeftToolbar />

            <div
                id="main-content"
                className={cn(
                    "overflow-auto pt-2 pl-2",
                    "max-h-dvh h-[calc(100dvh-var(--header-height))] mt-[var(--header-height)]",
                    "max-w-full h-[calc(100%-var(--left-toolbar-width))] ml-[var(--left-toolbar-width)]",
                )}
            >
                <Outlet />
            </div>

            <Footer />
        </MainLayoutProvider>
    );
}

export default MainLayout;
