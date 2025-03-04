import {cn} from "@/lib/utils";
import {Button} from "@headlessui/react";
import {PencilSquareIcon} from "@heroicons/react/20/solid";
import {TrashIcon} from "@heroicons/react/24/outline";
import {Res3dModelDataData} from "@/hooks/models/model";
import { Link } from "react-router-dom";
import { ROUTES } from "@/routes/routes";
import moment from "moment";

type ProductItemProps = {
    data: Res3dModelDataData
}

const formatDate = (dateString: moment.MomentInput) => {
    return moment(dateString).format("DD/MM/YYYY HH:mm:ss");
};

function ProductItem({data: {id, name, status, created_at, updated_at}}: ProductItemProps) {
    return (
        <div className={cn("w-full text-[#222] flex flex-wrap gap-5 border-b border-gray-200")}>
            {/* <div className={cn("relative bg-[#F8F8F8] h-[300px] flex justify-center items-center overflow-hidden")}>
                <Link
                    to={ROUTES.MODELS_DETAIL.replace(":id", String(id))}
                    className={cn("relative h-full w-full")}
                >
                    <img
                        className={cn("object-contain group-hover:scale-105 transition-transform duration-300")}
                        src={thumbnail}
                        alt={name}
                        sizes="100%"
                    />
                </Link>
            </div> */}
            <div className={cn("flex items-center justify-start gap-4 w-5/6")}>
                <p className={cn("text-xl leading-8 font-semibold w-[5%]")}>ID</p>
                <p className={cn("text-xl leading-8 font-semibold w-[40%]")}>Name</p>
                <p className={cn("text-xl leading-8 font-semibold w-[20%]")}>Created</p>
                <p className={cn("text-xl leading-8 font-semibold w-[20%]")}>Updated</p>
                <p className={cn("text-xl leading-8 font-semibold w-[15%]")}>Status</p>
            </div>

            <div className={cn("flex flex-wrap items-center justify-between gap-3 w-full")}>
                
                <Link className={cn("flex justify-start items-start gap-4 w-5/6")} 
                        to={ROUTES.MODELS_DETAIL.replace(":id", String(id))}>
                    <p className={cn("text-lg leading-8 font-normal line-clamp-2 w-[5%]")}>{id}</p>
                    <h2 className={cn("text-lg leading-8 font-normal line-clamp-2 w-[40%]")}>
                        {name}
                    </h2>
                    <p className={cn("text-lg leading-8 font-normal line-clamp-2 w-[20%]")}>{formatDate(updated_at)}</p>
                    <p className={cn("text-lg leading-8 font-normal line-clamp-2 w-[20%]")}>{formatDate(created_at)}</p>
                    <p className={cn("text-lg leading-8 font-normal line-clamp-2 w-[15%]")}>
                        {status}
                    </p>
                </Link>
                
                <div className={cn("flex justify-start gap-2")}>
                    <Button>
                        <PencilSquareIcon className={cn("size-6")}/>
                    </Button>
                    <Button>
                        <TrashIcon className={cn("size-6")}/>
                    </Button>
                </div>
            </div>
        </div>
        
    )
}

export default ProductItem;