import {cn} from "@/lib/utils.ts";

function Headers() {
    // const [activeMenu, setActiveMenu] = useState<number | null>(null);
    //
    // const handleMenuToggle = (menuId: number) => {
    //     setActiveMenu((prev) => (prev === menuId ? null : menuId));
    // };

    return (
        <div className={cn("flex justify-center bg-gray-100 py-4 h-[var(--header-height)] w-[calc(100%-var(--left-toolbar-width))] fixed top-0 right-0")}>
            {/*<div className="flex gap-8">*/}
            {/*    /!* Menu 1 *!/*/}
            {/*    <div className="relative">*/}
            {/*        <button*/}
            {/*            onClick={() => handleMenuToggle(1)}*/}
            {/*            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow hover:bg-gray-50"*/}
            {/*        >*/}
            {/*            Menu 1*/}
            {/*            <ChevronDownIcon className="w-5 h-5 text-gray-500"/>*/}
            {/*        </button>*/}
            {/*        {activeMenu === 1 && (*/}
            {/*            <div*/}
            {/*                className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">*/}
            {/*                <div className="py-1">*/}
            {/*                    <a*/}
            {/*                        href="#"*/}
            {/*                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
            {/*                    >*/}
            {/*                        Item 1*/}
            {/*                    </a>*/}
            {/*                    <a*/}
            {/*                        href="#"*/}
            {/*                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
            {/*                    >*/}
            {/*                        Item 2*/}
            {/*                    </a>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}

            {/*    /!* Menu 2 *!/*/}
            {/*    <div className="relative">*/}
            {/*        <button*/}
            {/*            onClick={() => handleMenuToggle(2)}*/}
            {/*            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-md shadow hover:bg-gray-50"*/}
            {/*        >*/}
            {/*            Menu 2*/}
            {/*            <ChevronDownIcon className="w-5 h-5 text-gray-500"/>*/}
            {/*        </button>*/}
            {/*        {activeMenu === 2 && (*/}
            {/*            <div*/}
            {/*                className="absolute left-0 mt-2 w-48 origin-top-left rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">*/}
            {/*                <div className="py-1">*/}
            {/*                    <a*/}
            {/*                        href="#"*/}
            {/*                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
            {/*                    >*/}
            {/*                        Item 1*/}
            {/*                    </a>*/}
            {/*                    <a*/}
            {/*                        href="#"*/}
            {/*                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"*/}
            {/*                    >*/}
            {/*                        Item 2*/}
            {/*                    </a>*/}
            {/*                </div>*/}
            {/*            </div>*/}
            {/*        )}*/}
            {/*    </div>*/}
            {/*</div>*/}
        </div>
    );
}

export default Headers;