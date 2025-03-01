export type ReqCategory = {
    limit: number
}

export type ResCategory = {
    data: Array<Category>
}

export type Category = {
    id: number
    parent_id: number
    name: string
    children: Array<Category>
}
