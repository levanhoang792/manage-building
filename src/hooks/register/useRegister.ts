import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";
import {ReqRegister, ResRegister} from "@/hooks/register/model";

import {API_ROUTES} from "@/routes/api";

// const queryKey = "register";

const useRegister = () => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqRegister) => {
            const resp = await httpPost(
                {
                    uri: API_ROUTES.REGISTER,
                    options: {body: JSON.stringify(params)}
                },
            )
            return await resp.json() as ResRegister;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

export {
    useRegister
};
