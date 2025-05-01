import {ResRequest} from "../model";

export interface Floor {
    id: number;
    building_id: number;
    name: string;
    floor_number: number;
    description?: string;
    floor_plan_image?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface FloorFormData {
    name: string;
    floor_number: number;
    description?: string;
    status?: 'active' | 'inactive';
    floorPlan?: File;
}

export interface FloorStatusData {
    status: 'active' | 'inactive';
}

export interface FloorQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface FloorListResponse {
    data: Floor[];
    total: number;
    page: number;
    limit: number;
}

export type ResFloorList = ResRequest<FloorListResponse>;
export type ResFloor = ResRequest<Floor>;