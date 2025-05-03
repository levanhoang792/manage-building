import {cn} from "@/lib/utils.ts";
import {Link, useLocation} from "react-router-dom";
import LogoSVG from "@/assets/icons/logo.svg?react";
import {ROUTES} from "@/routes/routes";
import {
    BuildingOffice2Icon,
    ChartBarIcon,
    ClockIcon,
    Cog6ToothIcon,
    KeyIcon,
    ShieldCheckIcon,
    UserGroupIcon,
    UserIcon
} from "@heroicons/react/24/outline";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

function LeftToolbar() {
    const location = useLocation();

    const isActive = (path: string) => {
        return location.pathname === path;
    };

    const isActiveGroup = (paths: string[]) => {
        return paths.some(path => {
            if (path.includes(':')) {
                const pathPattern = path.replace(/:\w+/g, '[^/]+');
                const regex = new RegExp(`^${pathPattern}$`);
                return regex.test(location.pathname);
            }
            return location.pathname === path;
        });
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

                {/* Door Types */}
                <Link to={ROUTES.DOOR_TYPES} className={menuItemClass(isActive(ROUTES.DOOR_TYPES))}>
                    <KeyIcon className="size-5"/>
                    <span>Door Types</span>
                </Link>

                {/* User Management Group */}
                <Disclosure as="div" className="w-full"
                            defaultOpen={isActiveGroup([ROUTES.USERS, ROUTES.USER_PENDING, ROUTES.ROLES])}>
                    <DisclosureButton
                        className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-100 rounded-md">
                        <span className="text-sm/6 font-medium text-left line-clamp-1 flex items-center gap-2">
                            <UserGroupIcon className="size-5"/>
                            User Management
                        </span>
                        <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                    </DisclosureButton>

                    <DisclosurePanel>
                        <Link to={ROUTES.USERS} className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md w-full ml-2",
                            "text-sm font-medium transition-colors",
                            isActive(ROUTES.USERS) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        )}>
                            <UserIcon className="size-4"/>
                            <span>Users</span>
                        </Link>

                        <Link to={ROUTES.USER_PENDING} className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md w-full ml-2",
                            "text-sm font-medium transition-colors",
                            isActive(ROUTES.USER_PENDING) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        )}>
                            <ClockIcon className="size-4"/>
                            <span>Pending Users</span>
                        </Link>

                        <Link to={ROUTES.ROLES} className={cn(
                            "flex items-center gap-2 px-3 py-2 rounded-md w-full ml-2",
                            "text-sm font-medium transition-colors",
                            isActive(ROUTES.ROLES) ? "bg-blue-100 text-blue-700" : "hover:bg-gray-100"
                        )}>
                            <ShieldCheckIcon className="size-4"/>
                            <span>Roles & Permissions</span>
                        </Link>
                    </DisclosurePanel>
                </Disclosure>

                {/* Settings Group */}
                <div className="mt-4">
                    <Disclosure as="div" className="w-full" defaultOpen={isActiveGroup([ROUTES.MODELS])}>
                        <DisclosureButton
                            className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-100 rounded-md">
                            <span className="text-sm/6 font-medium text-left line-clamp-1 flex items-center gap-2">
                                <Cog6ToothIcon className="size-5"/>
                                Settings
                            </span>
                            <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                        </DisclosureButton>
                        <Link to={ROUTES.MODELS}>
                            <DisclosurePanel
                                className="text-sm/5 text-black pl-6 pr-2 py-2 hover:bg-gray-100 rounded-md ml-2">
                                Models
                            </DisclosurePanel>
                        </Link>
                    </Disclosure>
                </div>
            </div>
        </div>
    );
}

export default LeftToolbar;
