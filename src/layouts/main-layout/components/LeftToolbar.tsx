import {cn} from "@/lib/utils.ts";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";
import { Link } from "react-router-dom";
import LogoSVG from "@/assets/icons/logo.svg?react";
import { ROUTES } from "@/routes/routes";

function LeftToolbar() {
    return (
        <div className={cn("bg-gray-100 w-[var(--left-toolbar-width)] fixed top-0 left-0 h-full overflow-auto")}>
            <div className={cn("h-[var(--header-height)]")}>
                {/*Logo    */}
                <div className={cn("h-full flex items-center justify-center gap-4 pr-4 lg:pl-4")}>
                    <Link to={ROUTES.HOME}>
                        <LogoSVG className={cn("size-8 lg:size-10 transition-all")}/>
                    </Link>
                </div>
            </div>

            <div className={cn("menu text-black px-2")}>
                <Disclosure as="div">
                    <DisclosureButton
                        className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-200">
                        <span className="text-sm/6 font-medium text-left line-clamp-1">
                            Models
                        </span>
                        <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                    </DisclosureButton>
                    <Link to={ROUTES.MODELS}>
                        <DisclosurePanel className="text-sm/5 text-black pl-6 pr-2 py-2 hover:bg-gray-200">
                            Models Detail
                        </DisclosurePanel>
                    </Link>
                </Disclosure>
                {/* <Disclosure as="div">
                    <DisclosureButton
                        className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-200">
                        <span className="text-sm/6 font-medium text-left line-clamp-1">
                          Do you offer technical support?
                        </span>
                        <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                    </DisclosureButton>
                    <DisclosurePanel className="text-sm/5 text-black pl-6 pr-2 py-2 hover:bg-gray-200">
                        No.
                    </DisclosurePanel>
                </Disclosure> */}
            </div>
        </div>
    );
}

export default LeftToolbar;