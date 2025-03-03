import {httpGet} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ResMaterial} from "@/hooks/materials/model";
import { useQuery } from "@tanstack/react-query";
const queryKey = "materials";

const fetchMaterials = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.MATERIALS}
    )
    return await resp.json() as ResMaterial;
}

const useFetchMaterials = () => {
    return useQuery({
        queryKey: [queryKey], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetchMaterials(),
    })
}

export {
    fetchMaterials,
    useFetchMaterials
};
