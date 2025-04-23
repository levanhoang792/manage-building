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
}

export type ResAuth = {
    token: string;
    user: {
        id: number;
        email: string;
        username: string;
        role: string;
    }
}