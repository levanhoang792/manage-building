import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResMaterial} from "@/hooks/materials/model";

const fetchMaterials = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.MATERIALS}
    )
    return await resp.json() as ResMaterial;
}

export {
    fetchMaterials
};
