import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResPlatform} from "@/hooks/platforms/model";

const fetchPlatforms = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.PLATFORMS}
    )
    return await resp.json() as ResPlatform;
}

export {
    fetchPlatforms
};
