export type ResLibraries = {
    id: number
    user_id: number
    parent_id: number
    name: string
    description: string
    created_at: string
    updated_at: string
}

export type ReqCreateLibrary = {
    name: string
    description?: string
    parent_id?: number
}

export type ResCreateLibrary = {
    id: number
    user_id: number
    parent_id?: number
    name: string
    description: null
    updated_at: string
    created_at: string
}

export type ReqCreateModelLibrary = {
    library_id: number
    product_id: number
}

export type ResCreateModelLibrary = {
    id: number
    name: string
    category_id: number
    platform_id: number
    render_id: number
    created_at: string
    updated_at: string
    user_id: number
}