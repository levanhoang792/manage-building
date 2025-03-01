import {cn} from "@/lib/utils";
import {Button, Menu, MenuButton, MenuItems} from "@headlessui/react";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import {EyeSlashIcon} from "@heroicons/react/24/outline";
import {Res3dModelDataData} from "@/hooks/models/model";
import Start from "@/assets/icons/start.svg?react";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";

type ProductItemProps = {
    data: Res3dModelDataData
}

function ProductItem({data: {id, name, thumbnail, is_favorite}}: ProductItemProps) {
    return (
        <div className={cn("group text-[#222] flex flex-col gap-5 rounded-2xl")}>
            <div className={cn("relative bg-[#F8F8F8] h-[300px] flex justify-center items-center overflow-hidden")}>
                <Link
                    to={ROUTES.MODELS_DETAIL.replace(":id", String(id))}
                    className={cn("relative h-full w-full")}
                >
                    <img
                        className={cn("object-contain group-hover:scale-105 transition-transform duration-300")}
                        src={thumbnail}
                        alt={name}
                        // fill
                        sizes="100%"
                    />
                </Link>

                <Button
                    className={cn(
                        "absolute top-2.5 right-2.5 hover:shadow transition",
                        "size-10 flex justify-center items-center rounded-full bg-white"
                    )}
                >
                    <Start
                        width={24}
                        height={24}
                        className={cn(
                            "transition",
                            is_favorite ? "text-[#FFC107] hover:text-[#DFDFDF]" : "text-[#DFDFDF] hover:text-[#FFC107]",
                        )}
                    />
                </Button>
            </div>

            <div className={cn("flex-grow flex flex-col justify-between gap-2.5")}>
                <div className={cn("flex-grow flex flex-col justify-between")}>
                    <div className={cn("flex justify-between items-start gap-4")}>
                        <Link to={ROUTES.MODELS_DETAIL.replace(":id", String(id))}>
                            <h2 className={cn("text-xl leading-8 font-semibold line-clamp-2")}>
                                {name}
                            </h2>
                        </Link>
                        <Button>
                            <PencilSquareIcon className={cn("size-6 mt-1")}/>
                        </Button>
                    </div>
                    <p>ID: {id}</p>
                </div>

                <div className={cn("flex gap-3")}>
                    <Button
                        className={cn(
                            "rounded-md border border-[#222] size-11 flex justify-center items-center",
                            "transition hover:bg-[#7D3200] hover:text-white"
                        )}
                    >
                        <EyeSlashIcon className={cn("size-6")}/>
                    </Button>
                    <Menu>
                        <MenuButton
                            className={cn(
                                "flex-grow rounded-lg border border-[#222] text-sm/5 font-semibold",
                                "flex justify-center items-center",
                                "transition hover:bg-[#7D3200] hover:text-white"
                            )}
                        >
                            Add my library
                        </MenuButton>

                        <MenuItems
                            modal={false}
                            transition
                            anchor={"bottom end"}
                            className={cn(
                                "relative w-[280px] z-10 rounded-lg pt-6 pb-3", // w-[var(--button-width)]
                                "bg-white shadow-shadow-1 border border-[#2222221f]",
                                "divide-y divide-white/5 rounded-xl text-sm/6 transition duration-200 ease-in-out",
                                "[--anchor-gap:.25rem] data-[closed]:-translate-y-1 data-[closed]:opacity-0"
                            )}
                        >
                            {/* <AddLibrary productId={id}/> */}
                        </MenuItems>
                    </Menu>
                </div>
            </div>
        </div>
    )
}

export default ProductItem;