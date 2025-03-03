import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResColor} from "@/hooks/colors/model";
import { useQuery } from "@tanstack/react-query";

const queryKey = "colors";

const fetchColors = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.COLORS}
    )
    return await resp.json() as ResColor;
}

const useFetchColors = () => {
    return useQuery({
        queryKey: [queryKey], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchColors(),
    })
}

export {
    fetchColors,
    useFetchColors
};
