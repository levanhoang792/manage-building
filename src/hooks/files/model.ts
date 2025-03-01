export type ReqUpload = {
    file: File
}

export type ResUpload = {
    file_url: string
    message: string
}

export type ResFile = {
    id: number
    file_path: string
    file_name: string
    product_id: number
    updated_at: string
    created_at: string
}