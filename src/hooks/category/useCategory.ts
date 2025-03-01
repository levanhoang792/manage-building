import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ReqCategory, ResCategory} from "@/hooks/category/model";

const fetchCategories = async (params: ReqCategory) => {
    const resp = await httpGet(
        {
            uri: API_ROUTES.CATEGORIES,
            options: {body: JSON.stringify(params)}
        }
    )
    return await resp.json() as ResCategory;
}

export {
    fetchCategories
};
