import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";
import {ReqEmail, ReqOtp, ReqPassword, ResForgotPassword} from "@/hooks/forgot-password/model";
import {API_ROUTES} from "@/routes/api";

export const useEmail = () => {
    return useMutation({
        mutationFn: async (data: ReqEmail) => {
            const resp = await httpPost({
                uri: API_ROUTES.FORGOT_PASSWORD_EMAIL,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResForgotPassword;
        }
    });
};

export const useOtp = () => {
    return useMutation({
        mutationFn: async (data: ReqOtp) => {
            const resp = await httpPost({
                uri: API_ROUTES.FORGOT_PASSWORD_OTP,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResForgotPassword;
        }
    });
};

export const usePassword = () => {
    return useMutation({
        mutationFn: async (data: ReqPassword) => {
            const resp = await httpPost({
                uri: API_ROUTES.FORGOT_PASSWORD_RESET,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResForgotPassword;
        }
    });
};
