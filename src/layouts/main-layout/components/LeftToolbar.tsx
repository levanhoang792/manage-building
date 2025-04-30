import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router-dom";
import LogoSVG from "@/assets/icons/logo.svg?react";
import {ROUTES} from "@/routes/routes";
import {BuildingOffice2Icon, ChartBarIcon, UserGroupIcon} from "@heroicons/react/24/outline";

function LeftToolbar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const menuItemClass = (active: boolean) => cn(
        "flex items-center gap-2 px-3 py-2 rounded-md w-full",
        "text-sm font-medium transition-colors",
        active ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
    );

    return (
        <div className={cn(
            "bg-white h-full w-[var(--left-toolbar-width)] rounded-lg shadow",
            "py-3 flex flex-col items-start gap-3"
        )}>
            <div className={cn("h-[var(--header-height)] w-full")}>
                <div className={cn("h-full flex items-center justify-center gap-4 pr-4 lg:pl-4")}>
                    <Link to={ROUTES.HOME}>
                        <LogoSVG className={cn("size-8 lg:size-10 transition-all")}/>
                    </Link>
                    <span className="text-lg font-bold">Building Manager</span>
                </div>
            </div>

            <div className={cn("menu text-black px-2 w-full flex-grow overflow-auto flex flex-col gap-1")}>
                {/* Dashboard */}
                <Link to={ROUTES.DASHBOARD} className={menuItemClass(isActive(ROUTES.DASHBOARD))}>
                    <ChartBarIcon className="size-5"/>
                    <span>Dashboard</span>
                </Link>

                {/* Buildings */}
                <Link to={ROUTES.BUILDINGS} className={menuItemClass(isActive(ROUTES.BUILDINGS))}>
                    <BuildingOffice2Icon className="size-5"/>
                    <span>Buildings</span>
                </Link>

                {/* Users */}
                <Link to={ROUTES.USERS} className={menuItemClass(isActive(ROUTES.USERS))}>
                    <UserGroupIcon className="size-5"/>
                    <span>Users</span>
                </Link>

                {/*<div className="mt-4">
                    <Disclosure as="div" className="w-full">
                        <DisclosureButton
                            className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-100 rounded-md">
                            <span className="text-sm/6 font-medium text-left line-clamp-1 flex items-center gap-2">
                                <HomeIcon className="size-5"/>
                                Models
                            </span>
                            <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                        </DisclosureButton>
                        <Link to={ROUTES.MODELS}>
                            <DisclosurePanel
                                className="text-sm/5 text-black pl-6 pr-2 py-2 hover:bg-gray-100 rounded-md ml-2">
                                Models List
                            </DisclosurePanel>
                        </Link>
                    </Disclosure>
                </div>*/}
            </div>
        </div>
    );
}

export default LeftToolbar;
