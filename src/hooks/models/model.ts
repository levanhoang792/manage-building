import {Platform} from "@/hooks/platforms/model";
import {Render} from "@/hooks/renders/model";
import {Category} from "@/hooks/category/model";
import {Tag} from "@/hooks/tags/model";
import {ResFile} from "@/hooks/files/model";
import {Color} from "@/hooks/colors/model";
import {Material} from "@/hooks/materials/model";

export type Req3dModelData = {
    limit?: number
    page?: number
}

export type Res3dModelDataData = {
    id: number
    name: string
    is_ads: boolean
    is_favorite: boolean
    thumbnail: string
    created_at: string
    updated_at: string
    status: String
}

export type Res3dModelDetailData = {
    id: number
    name: string
    is_ads: number
    is_favorite: number
    description: string
    category_id: number
    platform: Platform
    render: Render
    file_path: string
    thumbnail: string
    created_at: string
    updated_at: string
    listImageSrc: Array<string>
    category: Category
    tags: Array<Tag>
    files: Array<ResFile>
    colors: Array<Color>
    materials: Array<Material>
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