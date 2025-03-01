import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";
import {ReqEmail, ReqOtp, ReqPassword, ResUserData} from "@/hooks/forgot-password/model";

import {API_ROUTES} from "@/routes/api";

// const queryKey = "forgot-password";

const useEmail = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqEmail) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.FORGOT_PASSWORD,
                    options: {body: JSON.stringify(params)}
                },
            )
            return await resp.json() as ResUserData;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

const useOtp = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqOtp) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.FORGOT_PASSWORD,
                    options: {body: JSON.stringify(params)}
                },
            )
            return await resp.json() as ResUserData;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

const usePassword = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqPassword) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.FORGOT_PASSWORD,
                    options: {body: JSON.stringify(params)}
                },
            )
            return await resp.json() as ResUserData;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

export {
    useEmail,
    useOtp,
    usePassword
};
