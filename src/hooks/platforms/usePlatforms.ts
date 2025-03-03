import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResPlatform} from "@/hooks/platforms/model";
import { useQuery } from "@tanstack/react-query";

const queryKey = "platforms";

const fetchPlatforms = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.PLATFORMS}
    )
    return await resp.json() as ResPlatform;
}

const useFetchPlatforms = () => {
    return useQuery({
        queryKey: [queryKey], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchPlatforms(),
    })
}

export {
    fetchPlatforms,
    useFetchPlatforms
};
