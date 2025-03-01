export type ReqUserData = {
    q?: string,
}

export type ResUserData = {
    status: number,
    randomCode: number
}

export type ReqLogin = {
    email: string,
    password: string
}

export type ResLogin = {
    token: string
    user: ResLoginUser
}

export type ResLoginUser = {
    name: string,
    username: string,
    email: string
}

export type ResLogout = {
    message: string
}

export type ResUserToken = {
    id: number
    name: string
    email: string
    role_id: number
    created_at: string
    updated_at: string
    email_verified_at: string
}