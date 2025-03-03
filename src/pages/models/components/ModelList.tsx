import {cn} from "@/lib/utils";
import Pagination from "@/components/commons/Pagination";
import AdsItem from "./AdsItem";
import ProductItem from "./ProductItem";
import {useFetch3dModel} from "@/hooks/models/use3dModel";
import {useState} from "react";

// Bỏ async đi nếu có
// Các props search params này cũng bỏ (Cơ chế riêng của next)
function ModelList() {
    const [curPage, setCurPage] = useState<number>(1);

    // Con này không dùng await nhé, nextjs mới dung thấy cú pháp này thì convert qua dùng hook
    const model3d = useFetch3dModel({
        limit: 15,
        page: curPage,
    }); // Fetch từ server trước khi render

    const {data, meta} = model3d.data || {};

    const onChangePage = (page: number) => {
        console.log(page)
        setCurPage(page);
    }

    return (
        <>
            <div className={cn("flex flex-col gap-4 mb-7")}>
                {data?.map((item, index) =>
                    item.is_ads ? <AdsItem key={index} data={item} /> : <ProductItem key={index} data={item} />,
                )}
            </div>

            {meta && (
                <Pagination currentPage={meta.current_page} totalPage={meta.last_page} onPageChange={onChangePage} />
            )}
        </>
    );
}

export default ModelList;
