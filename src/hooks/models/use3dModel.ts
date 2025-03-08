import {httpDelete, httpGet, httpPost, httpPut} from "@/utils/api";
import {
    Req3dModelCreate,
    Req3dModelData,
    Req3dModelUpdate,
    ReqChangeStatus3dModel,
    Res3dModelCreate,
    Res3dModelDataData,
    Res3dModelDetailData,
    Res3dModelUpdateErrors
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

const fetch3dModelDetail = async (id: number) => {
    const resp = await httpGet(
        {
            uri: API_ROUTES.PRODUCTS_DETAIL.replace(":id", String(id))
        }
    )
    return await resp.json() as ResRequest<Res3dModelDetailData>;
}

const useFetch3dModelDetail = (id: number) => {
    return useQuery({
        queryKey: [queryKey, id], // các api list nhớ để thêm parám làm key || Để khi tạo mới nó sẽ tự refresh
        queryFn: () => fetch3dModelDetail(id!),
        enabled: !!id,
    })
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

const delete3dModel = async (id: number) => {
    const resp = await httpDelete(
        {
            uri: API_ROUTES.PRODUCTS_DELETE.replace(":id", String(id)),
        },
    )
    return await resp.json() as ResRequest<null>;
}

const use3dModelDelete = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: delete3dModel,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r)); // Hàm này sẽ tác động refresh hàm list
        },
        onError: () => {
        }
    });
};

const update3dModel = async (params: Req3dModelUpdate) => {
    const resp = await httpPut(
        {
            uri: API_ROUTES.PRODUCTS_UPDATE.replace(":id", String(params.id)),
            options: {body: JSON.stringify(params)}
        },
    )
    return await resp.json() as ResRequest<null, Res3dModelUpdateErrors>;
}

const use3dModelUpdate = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: update3dModel,
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r)); // Hàm này sẽ tác động refresh hàm list
        },
        onError: () => {
        }
    });
};

export {
    fetch3dModelDetail,

    useFetch3dModel,
    useFetch3dModelDetail,
    use3dModelCreate,
    useChangeStatus3dModel,
    use3dModelDelete,
    use3dModelUpdate
};