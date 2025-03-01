import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResRender} from "@/hooks/renders/model";

const fetchRenders = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.RENDERS}
    )
    return await resp.json() as ResRender;
}

export {
    fetchRenders
};
