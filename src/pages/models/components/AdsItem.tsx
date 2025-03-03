import {cn} from "@/lib/utils";
import {Button} from "@headlessui/react";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import InfoCircle from "@/assets/icons/info-circle.svg?react"; 
import Icon1 from "@/assets/icons/icon-1.svg?react";
import {Res3dModelDataData} from "@/hooks/models/model";

interface AdsItemProps {
    data: Res3dModelDataData;
}

function AdsItem({data: {thumbnail} }: AdsItemProps) {
    return (
        <div className={cn("text-[#222] flex flex-col gap-5")}>
            <div
                className={cn(
                    "relative rounded-2xl bg-[#F8F8F8] h-[300px] flex justify-center items-center"
                )}
            >
                {/* Re-style image */}
                <img
                    className={cn("object-contain")}
                    // fill
                    src={thumbnail}
                    alt="Logo page"
                    sizes="100%"
                />
            </div>

            <div className={cn("flex-grow flex flex-col justify-between gap-2.5")}>
                <div className={cn("flex-grow flex flex-col justify-between")}>
                    <div className={cn("flex justify-between items-start gap-4")}>
                        <h2 className={cn("text-xl leading-8 font-semibold line-clamp-2")}>
                            Lorem ipsum dolor sit
                        </h2>
                        <Button>
                            <PencilSquareIcon className={cn("size-6 mt-1")}/>
                        </Button>
                    </div>
                </div>

                <div className={cn("flex justify-between items-end gap-3")}>
                    <Button
                        className={cn(
                            "rounded-md border border-[#222] py-1 px-2.5 flex justify-center items-center",
                            "font-bold text-[#222] transition hover:bg-[#7D3200] hover:text-white"
                        )}
                    >
                        Add
                    </Button>

                    <div className={cn("flex")}>
                        <Button>
                            <InfoCircle
                                width={20}
                                height={20}
                            />
                        </Button>
                        <Button>
                            <Icon1
                                width={20}
                                height={20}
                            />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AdsItem;