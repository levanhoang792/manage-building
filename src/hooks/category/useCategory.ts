import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ReqCategory, ResCategory} from "@/hooks/category/model";
import { useQuery } from "@tanstack/react-query";

const queryKey = "categories";

const fetchCategories = async (params: ReqCategory) => {
    const resp = await httpGet(
        {
            uri: API_ROUTES.CATEGORIES,
            options: {body: JSON.stringify(params)}
        }
    )
    return await resp.json() as ResCategory;
}

const useFetchCategories = (params: ReqCategory) => {
    return useQuery({
        queryKey: [queryKey, params], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchCategories(params),
    })
}

export {
    fetchCategories,
    useFetchCategories
};
