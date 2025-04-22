import {cn} from "@/lib/utils";
import {PlusIcon} from "@heroicons/react/20/solid";
import {Link} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import Pagination from "@/components/commons/Pagination";

export default function Model3D() {
    return (
        <div className={cn("px-3 overflow-hidden flex flex-col w-full h-full")}>
            <div className={cn("py-3 flex justify-end gap-6 bg-white")}>
                <Link
                    to={ROUTES.MODELS_CREATE}
                    className={cn(
                        "px-8 flex justify-center items-center gap-2 rounded-lg border border-black h-10 max-h-full",
                        "hover:bg-[#7D3200] hover:text-white hover:border-transparent transition-colors",
                    )}
                    style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
                >
                    <PlusIcon className={cn("size-5")}/>
                    Create
                </Link>
            </div>

            <div className="my-3 flex-grow w-full overflow-auto">
                <table className="default-table relative">
                    <thead className={cn("sticky z-10 top-0 bg-white")}>
                    <tr>
                        <th className={cn("w-[50px]")}>ID</th>
                        <th className={cn("w-[150px]")}>Thumbnail</th>
                        <th>Name</th>
                        <th className={cn("w-[150px]")}>Upload by</th>
                        <th className={cn("w-[100px]")}>Public</th>
                        <th className={cn("w-[220px]")}>Created</th>
                        <th className={cn("w-[220px]")}>Updated</th>
                        <th className={cn("w-[200px]")}>Status</th>
                        <th className={cn("w-[50px]")}></th>
                    </tr>
                    </thead>
                    <tbody>

                    </tbody>
                </table>
            </div>

            <div className={cn("w-full bg-white py-3")}>
                <Pagination
                    currentPage={1}
                    totalPage={10}
                    onPageChange={() => {
                    }}
                />
            </div>
        </div>
    );
}
