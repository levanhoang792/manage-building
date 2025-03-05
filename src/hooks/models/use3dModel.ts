import {httpGet, httpPost} from "@/utils/api";
import {
    Req3dModelCreate,
    Req3dModelData,
    ReqChangeStatus3dModel,
    Res3dModelCreate,
    Res3dModelDataData,
    Res3dModelDetailData
} from "@/hooks/models/model";
import {API_ROUTES} from "@/routes/api";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {ResRequest, ResRequestPagination} from "@/hooks/model";

const queryKey = "3dModel";

const fetch3dModel = async (params: Req3dModelData) => {
    const resp = await httpGet(
        {
            uri: API_ROUTES.PRODUCTS,
            options: {body: JSON.stringify(params)}
        }
    )
    return await resp.json() as ResRequestPagination<Array<Res3dModelDataData>>;
}

const useFetch3dModel = (params: Req3dModelData) => {
    return useQuery({
        queryKey: [queryKey, params], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetch3dModel(params),
    })
}

const fetch3dModelDetail = async (id: string) => {
    const resp = await httpGet(
        {
            uri: API_ROUTES.PRODUCTS_DETAIL.replace(":id", id)
        }
    )
    return await resp.json() as ResRequest<Res3dModelDetailData>;
}

const create3dModel = async (params: Req3dModelCreate) => {
    const resp = await httpPost(
        {
            uri: API_ROUTES.PRODUCTS,
            options: {body: JSON.stringify(params)}
        },
    )
    return await resp.json() as Res3dModelCreate;
}

const use3dModelCreate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: create3dModel,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r)); // Hàm này sẽ tác động refresh hàm list
        },
        onError: () => {
        }
    });
};

const changeStatus3dModel = async (params: ReqChangeStatus3dModel) => {
    const resp = await httpPost(
        {
            uri: API_ROUTES.PRODUCTS_CHANGE_STATUS.replace(":id", String(params.id)),
            options: {body: JSON.stringify(params)}
        },
    )
    return await resp.json() as ResRequest<null>;
}

const useChangeStatus3dModel = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: changeStatus3dModel,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r)); // Hàm này sẽ tác động refresh hàm list
        },
        onError: () => {
        }
    });
};

export {
    useFetch3dModel,

    fetch3dModelDetail,

    use3dModelCreate,
    useChangeStatus3dModel
};