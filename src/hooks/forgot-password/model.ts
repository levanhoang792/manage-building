export type ResUserData = {
    status: number,
    randomCode: number
}

export type ReqEmail = {
    email: string
}

export type ReqOtp = {
    otp: string
}

export type ReqPassword = {
    newPassword: string;
    confirmPassword: string;
}

export type ResForgotPassword = {
    status: number;
    message: string;
    code?: string;
}
