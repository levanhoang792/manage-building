import {cn} from "@/lib/utils";
import {Field, Input, Label, Menu, MenuButton, MenuItem, MenuItems,} from "@headlessui/react";
import {EllipsisVerticalIcon, MagnifyingGlassIcon} from "@heroicons/react/20/solid";
import {CloudArrowUpIcon} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useState} from "react";
import {useFetch3dModel} from "@/hooks/models/use3dModel";
import ProductItem from "@/pages/models/components/ProductItem";
import Pagination from "@/components/commons/Pagination";

export default function Model3D() {
    const [curPage, setCurPage] = useState<number>(1);

    // Con này không dùng await nhé, nextjs mới dung thấy cú pháp này thì convert qua dùng hook
    const model3d = useFetch3dModel({
        limit: 10,
        page: curPage,
    }); // Fetch từ server trước khi render

    const {data, meta} = model3d.data || {};

    const onChangePage = (page: number) => {
        setCurPage(page);
    }

    return (
        <div className={cn("container mx-auto px-4 relative")}>
            <div className={cn("py-3 flex gap-6 sticky top-0 bg-white")}>
                <Field className={cn("flex-grow")}>
                    <Label className={cn("hidden")}>Search in 3D model...</Label>
                    <div className={cn("relative flex items-center w-full")}>
                        <MagnifyingGlassIcon className={cn("size-5 absolute left-6")}/>
                        <Input
                            name="full_name"
                            type="text"
                            placeholder="Search in 3D model..."
                            className={cn(
                                "h-[52px] w-full rounded-lg bg-[#F8F8F8] border border-[#C9CDD4]",
                                "px-12 outline-none text-sm/5",
                            )}
                        />
                    </div>
                </Field>

                <Link
                    to={ROUTES.MODELS_CREATE}
                    className={cn(
                        "px-8 flex justify-center items-center gap-2 rounded-lg border border-black",
                        "hover:bg-[#7D3200] hover:text-white hover:border-transparent transition-colors",
                    )}
                    style={{boxShadow: "0px 20px 25px -5px rgba(0, 0, 0, 0.10), 0px 8px 10px -6px rgba(0, 0, 0, 0.10)"}}
                >
                    Upload model
                    <CloudArrowUpIcon className={cn("size-5")}/>
                </Link>
            </div>

            <table className={cn("w-full")}>
                <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Created At</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {data?.map((item, index) =>
                    <tr key={index}>
                        <td>{item.id}</td>
                        <td>{item.name}</td>
                        <td>{item.created_at}</td>
                        <td>
                            <Menu>
                                <MenuButton
                                    className={cn(
                                        "hover:bg-gray-200 p-1 rounded-lg transition"
                                    )}
                                >
                                    <EllipsisVerticalIcon className={cn("size-6")}/>
                                </MenuButton>

                                <MenuItems
                                    transition
                                    anchor="bottom end"
                                    className={cn(
                                        "w-52 max-w-full bg-white rounded-lg border border-gray-200 shadow",
                                        "p-3 text-sm/6 text-black transition duration-100 ease-out",
                                        "[--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                    )}
                                >
                                    <MenuItem>
                                        <Link to={ROUTES.MODELS_DETAIL.replace(":id", String(item.id))}>
                                            Detail
                                        </Link>
                                    </MenuItem>
                                </MenuItems>
                            </Menu>
                            {/*<Button>
                                <PencilSquareIcon className={cn("size-6")}/>
                            </Button>
                            <Button>
                                <TrashIcon className={cn("size-6")}/>
                            </Button>*/}
                        </td>
                    </tr>
                )}
                </tbody>
            </table>

            <div className={cn("flex flex-col gap-4 mb-7")}>
                {data?.map((item, index) =>
                    <ProductItem key={index} data={item}/>
                )}
            </div>

            <div className={cn("sticky bottom-0 w-full bg-white py-3")}>
                {meta && (
                    <Pagination
                        currentPage={meta.current_page}
                        totalPage={meta.last_page}
                        onPageChange={onChangePage}
                    />
                )}
            </div>
        </div>
    );
}
