import {cn} from "@/lib/utils.ts";
import {ArrowLeftStartOnRectangleIcon, Cog6ToothIcon, UserCircleIcon} from "@heroicons/react/20/solid";
import {Menu, MenuButton, MenuItem, MenuItems} from "@headlessui/react";
import {Link} from "react-router-dom";
import {ROUTES} from "@/routes/routes";

function Headers() {
    return (
        <div
            className={cn("flex justify-between items-center bg-gray-100 py-1 px-4 h-[var(--header-height)] w-[calc(100%-var(--left-toolbar-width))] fixed top-0 right-0")}>
            <div></div>
            <div>
                <Menu>
                    <MenuButton
                        className="rounded-full p-1 bg-gray-700">
                        <UserCircleIcon className={cn("size-6 fill-white")}/>
                    </MenuButton>

                    <MenuItems
                        transition
                        anchor="bottom end"
                        className={cn(
                            "w-52 max-w-full bg-gray-100 rounded-xl border border-gray-200 shadow-2xl",
                            "p-1 text-sm/6 text-black transition duration-100 ease-out",
                            "[--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                        )}
                    >
                        <MenuItem>
                            <Link
                                to={ROUTES.ACCOUNT_SETTING}
                                className={cn(
                                    "group flex w-full items-center gap-2 py-1.5 px-3",
                                    "hover:bg-gray-200 w-full rounded-lg"
                                )}
                            >
                                <Cog6ToothIcon className="size-4 fill-black"/>
                                Account Setting
                            </Link>
                        </MenuItem>
                        <MenuItem>
                            <Link
                                to={ROUTES.LOGOUT}
                                className={cn(
                                    "group flex w-full items-center gap-2 py-1.5 px-3",
                                    "hover:bg-gray-200 w-full rounded-lg"
                                )}
                            >
                                <ArrowLeftStartOnRectangleIcon className="size-4 fill-black"/>
                                Logout
                            </Link>
                        </MenuItem>
                    </MenuItems>
                </Menu>
            </div>
        </div>
    );
}

export default Headers;