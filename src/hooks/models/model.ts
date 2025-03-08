export type Req3dModelData = {
    limit?: number
    page?: number
}

export type Res3dModelDataData = {
    id: number
    name: string
    category_id: number
    platform_id: number
    render_id: number
    created_at: string
    updated_at: string
    user_id: number
    status: string
    public: number
    image_files: Array<Res3dModelDataDataFile>
    user: Res3dModelDataDataUser
}

export type Res3dModelDataDataFile = {
    id: number
    file_name: string
    file_path: string
    created_at: string
    updated_at: string
    pivot: Res3dModelDataFilePivot
}

export type Res3dModelDataFilePivot = {
    product_id: number
    file_id: number
    is_model: boolean
    is_thumbnail: boolean
}

export type Res3dModelDataDataUser = {
    id: number
    name: string
    email: string
    email_verified_at: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailData = {
    id: number
    name: string
    created_at: string
    updated_at: string
    user_id: number
    status: string
    public: boolean
    category: Res3dModelDetailDataCategory
    tags: Array<Res3dModelDetailDataTags>
    image_files: Array<Res3dModelDetailDataImageFiles>
    model_file: Res3dModelDetailDataModelFiles
    platform: Res3dModelDetailDataPlatform
    render: Res3dModelDetailDataRender
    colors: Array<Res3dModelDetailDataColor>
    materials: Array<Res3dModelDetailDataMaterial>
}

export type Res3dModelDetailDataCategory = {
    id: number
    name: string
    parent_id: number
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataTags = {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataImageFiles = {
    id: number
    file_name: string
    file_path: string
    created_at: string
    updated_at: string
    pivot: Res3dModelDetailDataImageFilesPivot
}

export type Res3dModelDetailDataImageFilesPivot = {
    product_id: number
    file_id: number
    is_model: boolean
    is_thumbnail: number
}

export type Res3dModelDetailDataModelFiles = {
    id: number
    file_name: string
    file_path: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataPlatform = {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataRender = {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataColor = {
    id: number
    name: string
    hex_code: string
    created_at: string
    updated_at: string
}

export type Res3dModelDetailDataMaterial = {
    id: number
    name: string
    created_at: string
    updated_at: string
}

export type Req3dModelCreate = {
    name: string
    description?: string
    category_id: number
    platform_id: number
    render_id: number
    color_ids: number[]
    material_ids: number[]
    file_url: string
    image_urls: string[],
    tag_ids: number[]
}

export type Res3dModelCreate = {
    r: number
    msg: string
}

export type ReqChangeStatus3dModel = {
    id: number
    status: string
}

export type Req3dModelUpdate = {
    id: number
    name: string
    description?: string
    category_id: number
    platform_id: number
    render_id: number
    color_ids: number[]
    material_ids: number[]
    file_url: string
    image_urls: string[],
    tag_ids: number[]
}

export type Res3dModelUpdateErrors = {
    name?: string[]
    description?: string[]
    category_id?: string[]
    platform_id?: string[]
    render_id?: string[]
    color_ids?: string[]
    material_ids?: string[]
    file_url?: string[]
    image_urls?: string[]
    tag_ids?: string[]
}