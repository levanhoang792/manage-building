"use client";

import {cn} from "@/lib/utils";
import Image from "next/image";
import StarNewIn from "@/assets/icons/star-new-in.svg";
import Lock from "@/assets/icons/lock.svg";
import {Res3dModelDataData} from "@/hooks/models/model";
import {useState} from "react";

type ViewDetailProps = {
    data: Res3dModelDataData
}

function ViewDetail({data: {name, image_path, listImgSrc}}: ViewDetailProps) {
    const [selectedImgSrc, setSelectedImgSrc] = useState(image_path);
    const [isFading, setIsFading] = useState(false);

    const handleImageChange = (src: string) => {
        if (src !== selectedImgSrc) {
            setIsFading(true); // Kích hoạt hiệu ứng mờ dần
            setTimeout(() => {
                setSelectedImgSrc(src);
                setIsFading(false); // Hiện ảnh mới
            }, 200); // Delay để đồng bộ hiệu ứng
        }
    };

    return (
        <>
            <div
                className={cn(
                    "flex flex-col gap-4 flex-grow max-h-full overflow-auto w-[140px]"
                )}
                // style={{
                //     scrollbarWidth: "none", // Ẩn thanh cuộn trên Firefox
                //     msOverflowStyle: "none", // Ẩn thanh cuộn trên IE/Edge
                // }}
            >
                {listImgSrc?.map((imgSrc, index) => (
                    <div
                        key={index}
                        className={cn(
                            "group rounded-2xl bg-[#F8F8F8] px-4 py-8 h-[157px]",
                            "flex justify-center items-center flex-shrink-0",
                            "hover:cursor-pointer"
                        )}
                        onClick={() => handleImageChange(imgSrc)}
                    >
                        <div
                            className={cn(
                                "relative w-full h-full",
                                "group-hover:scale-125 overflow-hidden",
                                "transition-transform duration-300"
                            )}
                        >
                            <Image
                                src={imgSrc}
                                alt={name}
                                className={cn("object-contain")}
                                fill
                                priority
                                sizes="auto"
                            />
                        </div>
                    </div>
                ))}
            </div>

            <div className={cn("flex flex-col w-[620px] xl:w-[640px] h-[678px] bg-[#F8F8F8] rounded-2xl")}>
                <div className={cn("flex justify-between")}>
                    <div
                        className={cn("flex justify-center items-center px-4 py-3 bg-white rounded-full  gap-1")}>
                        <StarNewIn width={12} height={12}/>
                        <p className={cn("font-normal text-[12px]")}>New in</p>
                    </div>
                    <div className={cn("flex justify-center items-center p-3 bg-white rounded-full  gap-1")}>
                        <Lock width={16} height={16}/>
                    </div>
                </div>
                <div className={cn("flex-grow relative flex mt-9 mb-[5.44rem]")}>
                    <Image
                        className={cn(
                            "object-contain transition-opacity duration-200 ease-in-out",
                            isFading ? "opacity-0" : "opacity-100"
                        )}
                        src={selectedImgSrc}
                        alt={name}
                        fill
                        priority
                        sizes="auto"
                    />
                </div>
            </div>
        </>
    )
}

export default ViewDetail;