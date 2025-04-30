import { useMutation } from "@tanstack/react-query";
import { httpPut } from "@/utils/api";
import { ReqUpdateProfile, ResUpdateProfile } from "@/hooks/profile/model";
import { API_ROUTES } from "@/routes/api";
import { ResRequest } from "@/hooks/model";

/**
 * Hook để cập nhật thông tin hồ sơ người dùng
 * @returns Mutation object để cập nhật hồ sơ
 */
const useUpdateProfile = () => {
    return useMutation({
        mutationFn: async (params: ReqUpdateProfile) => {
            const resp = await httpPut({
                uri: API_ROUTES.PROFILE_UPDATE,
                options: { body: JSON.stringify(params) }
            });
            return await resp.json() as ResRequest<ResUpdateProfile>;
        },
        onSuccess: (data) => {
            console.log('Profile update successful:', data);
        },
        onError: (error) => {
            console.error('Profile update error:', error);
        }
    });
};

export { useUpdateProfile };