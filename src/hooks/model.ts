export type MetaPagination = {
    meta: Pagination
}

export type Pagination = {
    current_page: number
    last_page: number
    per_page: number
    total: number
}

export type ResRequest<T> = {
    r: number
    msg: string
    data: T
}

export type ResRequestPagination<T> = {
    r: number
    msg: string
    data: T
    meta: Pagination
}
