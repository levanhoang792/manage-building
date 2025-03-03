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

function ProductItem({data: {id, name, thumbnail, created_at}}: ProductItemProps) {
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

            <div className={cn("flex flex-wrap items-center justify-between gap-3 w-full")}>
                
                <Link className={cn("flex justify-between items-start gap-4 w-2/4")} 
                        to={ROUTES.MODELS_DETAIL.replace(":id", String(id))}>
                    <p className={cn("text-xl leading-8 font-semibold line-clamp-2")}>ID: {id}</p>
                    <h2 className={cn("text-xl leading-8 font-semibold line-clamp-2")}>
                        Name: {name}
                    </h2>
                    <p className={cn("text-xl leading-8 font-semibold line-clamp-2")}>Created: {formatDate(created_at)}</p>
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