export type ReqUserData = {
    q?: string,
}

export type ResUserData = {
    status: number,
    randomCode: number
}

export type ReqLogin = {
    email: string,
    password: string,
    isRemember: boolean
}

export type ResLogin = {
    token: string
    user: ResLoginUser
}

export type ResLoginUser = {
    id: number
    username: string
    email: string
    fullName: string
    roles: Array<ResLoginUserRole>
}

export type ResLoginUserRole = {
    id: number
    name: string
}

export type ResLogout = {
    message: string
}

export type ResUserToken = {
    token: string
    user: ResUserTokenUser
}

export type ResUserTokenUser = {
    id: number
    username: string
    email: string
    fullName: string
    roles: Array<ResLoginUserRole>
}

export type UserFormData = {
    username: string;
    email: string;
    password: string;
    role: string;
}

export type EditUserFormData = Omit<UserFormData, 'password'>;

export type ChangePasswordFormData = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export type User = {
    id: number
    username: string
    email: string
    role: string
}