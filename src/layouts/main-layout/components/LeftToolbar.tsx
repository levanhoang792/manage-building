import {cn} from "@/lib/utils.ts";
import {Disclosure, DisclosureButton, DisclosurePanel} from "@headlessui/react";
import {ChevronDownIcon} from "@heroicons/react/20/solid";

function LeftToolbar() {
    return (
        <div className={cn("bg-gray-100 w-[var(--left-toolbar-width)] fixed top-0 left-0 h-full overflow-auto")}>
            <div className={cn("h-[var(--header-height)]")}>
                {/*Logo    */}
            </div>

            <div className={cn("menu text-black px-2")}>
                <Disclosure as="div">
                    <DisclosureButton
                        className="group px-2 py-2 flex w-full items-center justify-between hover:bg-gray-200">
                        <span className="text-sm/6 font-medium text-left line-clamp-1">
                          What is your refund policy?
                        </span>
                        <ChevronDownIcon className="size-5 text-black group-data-[open]:rotate-180 transition"/>
                    </DisclosureButton>
                    <DisclosurePanel className="text-sm/5 text-black pl-6 pr-2 py-2 hover:bg-gray-200">
                        If you're unhappy with your purchase, we'll refund you in full.
                    </DisclosurePanel>
                </Disclosure>
                <Disclosure as="div">
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
                </Disclosure>
            </div>
        </div>
    );
}

export default LeftToolbar;