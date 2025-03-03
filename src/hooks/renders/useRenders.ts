import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResRender} from "@/hooks/renders/model";
import { useQuery } from "@tanstack/react-query";

const queryKey = "renders";

const fetchRenders = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.RENDERS}
    )
    return await resp.json() as ResRender;
}

const useFetchRenders = () => {
    return useQuery({
        queryKey: [queryKey], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchRenders(),
    })
}

export {
    fetchRenders,
    useFetchRenders
};
