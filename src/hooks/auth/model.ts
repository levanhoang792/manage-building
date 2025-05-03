export type LoginFormData = {
    email: string;
    password: string;
    isRemember: boolean;
}

export type RegisterFormData = {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
    fullName?: string;
}

export type ResAuth = {
    token: string;
    message?: string;
    user: {
        id: number;
        email: string;
        username: string;
        fullName?: string;
        role?: string;
        roles?: Array<{
            id: number;
            name: string;
        }>;
    }
}