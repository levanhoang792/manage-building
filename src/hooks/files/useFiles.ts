import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";

import {API_ROUTES} from "@/routes/api";
import {ReqUpload, ResUpload} from "@/hooks/files/model";
import {objectToFormData} from "@/utils/utils";

// const queryKey = "upload";

const useUpload = (path: string) => {
    // const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (params: ReqUpload) => {
            const resp = await httpPost(
                {
                    uri: path,
                    options: {body: objectToFormData(params)}
                },
            )
            return await resp.json() as ResUpload;
        },
        onSuccess: () => {
            // queryClient.invalidateQueries({queryKey: [queryKey]}).then(r => console.log("Re-fetching data: ", r));
        },
        onError: () => {
        }
    });
};

const useUploadModel = () => {
    return useUpload(API_ROUTES.UPLOAD_TEMP_MODEL);
};

const useUploadImage = () => {
    return useUpload(API_ROUTES.UPLOAD_TEMP_IMAGES);
};

export {
    useUploadModel,
    useUploadImage
};
