import {useMutation} from "@tanstack/react-query";
import {httpPost} from "@/utils/api";
import {LoginFormData, RegisterFormData, ResAuth} from "./model";
import {API_ROUTES} from "@/routes/api";
import Cookies from "js-cookie";
import {COOKIES} from "@/utils/cookies";

export const useLogin = () => {
    return useMutation({
        mutationFn: async (data: LoginFormData) => {
            const resp = await httpPost({
                uri: API_ROUTES.AUTH_LOGIN,
                options: {body: JSON.stringify(data)}
            });
            const result = await resp.json() as ResAuth;
            if (data.isRemember) {
                Cookies.set(COOKIES.TOKEN, result.token);
            }
            return result;
        }
    });
};

export const useRegister = () => {
    return useMutation({
        mutationFn: async (data: RegisterFormData) => {
            const resp = await httpPost({
                uri: API_ROUTES.REGISTER,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResAuth;
        }
    });
};