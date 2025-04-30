import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";
import {ChangePasswordFormData, ReqLogin, ResLogin, ResLogout, ResUserToken} from "@/hooks/users/model";

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
                    uri: API_ROUTES.AUTH_LOGIN,
                    options: {body: JSON.stringify(params)}
                },
            );
            return await resp.json() as ResRequest<ResLogin>;
        },
        onSuccess: (data) => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
            console.log('Login successful:', data);
        },
        onError: (error) => {
            console.error('Login mutation error:', error);
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
    const resp = await httpPost(
        {uri: API_ROUTES.AUTH_REFRESH_TOKEN}
    )
    return await resp.json() as ResRequest<ResUserToken>;
};

/**
 * Hook để kiểm tra token còn hạn hay không khi F5 lại trang
 * @returns Query object với thông tin về token
 */
const useCheckExpireToken = () => {
    return useMutation({
        mutationFn: checkExpireToken,
        onSuccess: () => {
        },
        onError: () => {
        }
    });
};

/**
 * Hook để thay đổi mật khẩu người dùng
 * @returns Mutation object để thay đổi mật khẩu
 */
const useChangePassword = () => {
    return useMutation({
        mutationFn: async (params: ChangePasswordFormData) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.PROFILE_CHANGE_PASSWORD,
                    options: {body: JSON.stringify(params)}
                },
            );
            return await resp.json() as ResRequest<null>;
        },
        onSuccess: (data) => {
            console.log('Password changed successfully:', data);
        },
        onError: (error) => {
            console.error('Change password mutation error:', error);
        }
    });
};

export {
    /*useUsers,*/
    useLogin,
    useLogout,
    useCheckExpireToken,
    useChangePassword
};
