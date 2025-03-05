import Headers from "@/layouts/main-layout/components/Headers.tsx";
import LeftToolbar from "@/layouts/main-layout/components/LeftToolbar.tsx";
import Footer from "@/layouts/main-layout/components/Footer.tsx";
import {cn} from "@/lib/utils.ts";
import {MainLayoutProvider} from "@/layouts/main-layout/context/MainLayoutProvider";
import {Outlet} from "react-router-dom";

function MainLayout() {
    return (
        <MainLayoutProvider>
            <div className={cn("bg-gray-200 h-dvh w-full flex gap-2 p-2")}>
                <LeftToolbar/>

                <div className={cn("flex-grow flex flex-col gap-2")}>
                    <Headers/>

                    <div id="main-content" className={cn("overflow-hidden rounded-lg shadow h-full")}>
                        <div className={cn("overflow-auto h-full bg-white rounded-lg")}>
                            <Outlet/>
                        </div>
                    </div>

                    <Footer/>
                </div>
            </div>
        </MainLayoutProvider>
    );
}

export default MainLayout;
