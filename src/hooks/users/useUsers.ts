import {useMutation} from "@tanstack/react-query";
import {httpGet, httpPost} from "@/utils/api";
import {ReqLogin, ResLogin, ResLogout, ResUserToken} from "@/hooks/users/model";

import {API_ROUTES} from "@/routes/api";
import {ResRequest} from "@/hooks/model";

// const queryKey = "users";

/*const useUsers = (params: ReqUserData) => {
    return useQuery({
        queryKey: [queryKey, JSON.stringify(params)],
        queryFn: async () => {
            const resp = await httpGet(
                {
                    uri: API_ROUTES.LOGIN,
                    options: {body: JSON.stringify(params)}
                }
            )
            return await resp.json() as ResUserData;
        },
        // retry: false // ✅ Tắt tự động retry
    })
}*/

const useLogin = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqLogin) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.LOGIN,
                    options: {body: JSON.stringify(params)}
                },
            )
            return await resp.json() as ResLogin;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

const useLogout = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.LOGOUT,
                },
            )
            return await resp.json() as ResLogout;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

const checkExpireToken = async () => {
    const resp = await httpGet(
        {uri: API_ROUTES.USER_TOKEN}
    )
    return await resp.json() as ResRequest<ResUserToken>;
};

const useCheckExpireToken = () => {
    return useMutation({
        mutationFn: checkExpireToken,
        onSuccess: () => {
        },
        onError: () => {
        }
    });
};

export {
    /*useUsers,*/
    useLogin,
    useLogout,
    useCheckExpireToken
};
