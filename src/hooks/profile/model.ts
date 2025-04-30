import {ResLoginUser} from "@/hooks/users/model";

export type ReqUpdateProfile = {
    username: string;
    email: string;
    fullName: string;
    phone?: string;
}

export type ResUpdateProfile = ResLoginUser;