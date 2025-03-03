import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResTag} from "@/hooks/tags/model";
import { useQuery } from "@tanstack/react-query";
const queryKey = "tags";

const fetchTags = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.TAGS}
    )
    return await resp.json() as ResTag;
}

const useFetchTags = () => {
    return useQuery({
        queryKey: [queryKey], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchTags(),
    })
}

export {
    fetchTags,
    useFetchTags
};
