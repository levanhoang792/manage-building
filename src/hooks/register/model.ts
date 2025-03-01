export type ReqRegister = {
    name: string,
    email: string,
    password: string,
    password_confirmation: string
}

export type ResRegister = {
    message: string,
    user: ResRegisterUser
}

export type ResRegisterUser = {
    name: string
    email: string
    updated_at: string
    created_at: string
    id: number
}
