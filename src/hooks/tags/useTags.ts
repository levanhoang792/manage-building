import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResTag} from "@/hooks/tags/model";

const fetchTags = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.TAGS}
    )
    return await resp.json() as ResTag;
}

export {
    fetchTags
};
