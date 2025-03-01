import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResColor} from "@/hooks/colors/model";

const fetchColors = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.COLORS}
    )
    return await resp.json() as ResColor;
}

export {
    fetchColors
};
