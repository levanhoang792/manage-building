import styles from "@/pages/models/page.module.scss";
import {cn} from "@/lib/utils";
import {Field, Input, Label, Menu, MenuButton, MenuItem, MenuItems,} from "@headlessui/react";
import {EllipsisVerticalIcon, MagnifyingGlassIcon, PencilSquareIcon} from "@heroicons/react/20/solid";
import {CloudArrowUpIcon, TrashIcon} from "@heroicons/react/24/outline";
import {Link} from "react-router-dom";
import {ROUTES} from "@/routes/routes";
import {useState} from "react";
import {useFetch3dModel} from "@/hooks/models/use3dModel";
import Pagination from "@/components/commons/Pagination";
import moment from "moment";
import {DATE_FORMAT_DEFAULT, STATUS_LIST_MAP_COLOR} from "@/utils/string";

const limit = 10;

export default function Model3D() {
    const [curPage, setCurPage] = useState<number>(1);

    // Con này không dùng await nhé, nextjs mới dung thấy cú pháp này thì convert qua dùng hook
    const model3d = useFetch3dModel({
        limit: limit,
        page: curPage,
    }); // Fetch từ server trước khi render

    const {data, meta} = model3d.data || {};

    const onChangePage = (page: number) => {
        setCurPage(page);
    }

    return (
        <div className={cn("px-3 overflow-hidden flex flex-col w-full h-full")}>
            <div className={cn("py-3 flex gap-6 bg-white")}>
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

            <div className="my-3 flex-grow overflow-auto">
                <table className="default-table relative">
                    <thead className={cn("sticky top-0 bg-white")}>
                    <tr>
                        <th className={cn("w-[50px]")}>ID</th>
                        <th className={cn("w-[150px]")}>Thumbnail</th>
                        <th>Name</th>
                        <th className={cn("w-[150px]")}>Upload by</th>
                        <th className={cn("w-[220px]")}>Created</th>
                        <th className={cn("w-[220px]")}>Updated</th>
                        <th className={cn("w-[200px]")}>Status</th>
                        <th className={cn("w-[50px]")}></th>
                    </tr>
                    </thead>
                    <tbody>
                    {data?.map((item, index) => (
                        <tr key={index}>
                            <td className={cn("text-right")}>{(curPage - 1) * limit + index + 1}</td>
                            <td className={cn("flex justify-center")}>
                                <img
                                    alt={item.name}
                                    src={item.thumbnail}
                                    className={cn("size-16 rounded-lg")}
                                />
                            </td>
                            <td>{item.name}</td>
                            <td>{item.user_id}</td>
                            <td className={cn("text-center")}>{moment(item.created_at).format(DATE_FORMAT_DEFAULT)}</td>
                            <td className={cn("text-center")}>{moment(item.updated_at).format(DATE_FORMAT_DEFAULT)}</td>
                            <td className={cn("text-center")}>
                                <p
                                    className={cn("text-sm font-semibold text-white rounded-full py-2 px-4 line-clamp-1")}
                                    style={{
                                        backgroundColor: STATUS_LIST_MAP_COLOR[item.status as keyof typeof STATUS_LIST_MAP_COLOR] || "text-gray-500"
                                    }}
                                >
                                    {item.status}
                                </p>
                            </td>
                            <td className={cn("text-center")}>
                                <Menu>
                                    <MenuButton
                                        className={cn(
                                            "hover:bg-gray-200 py-1.5 px-2 rounded-lg transition"
                                        )}
                                    >
                                        <EllipsisVerticalIcon className={cn("size-6")}/>
                                    </MenuButton>

                                    <MenuItems
                                        transition
                                        anchor="bottom end"
                                        className={cn(
                                            "w-40 max-w-full bg-white rounded-lg border border-gray-200 shadow",
                                            "text-sm/6 text-black transition duration-100 ease-out",
                                            "[--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                                        )}
                                    >
                                        <MenuItem>
                                            <Link
                                                to={ROUTES.MODELS_DETAIL.replace(":id", String(item.id))}
                                                className={cn(styles.menuItem)}
                                            >
                                                <PencilSquareIcon className={cn("size-5")}/> Detail
                                            </Link>
                                        </MenuItem>
                                        <MenuItem>
                                            <Link
                                                to={ROUTES.MODELS_DETAIL.replace(":id", String(item.id))}
                                                className={cn(styles.menuItem)}
                                            >
                                                <TrashIcon className={cn("size-5")}/> Delete
                                            </Link>
                                        </MenuItem>
                                    </MenuItems>
                                </Menu>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className={cn("w-full bg-white py-3")}>
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
