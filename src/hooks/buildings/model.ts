import {ResRequest} from "../model";

export interface Building {
    id: number;
    name: string;
    address: string;
    description?: string;
    status: 'active' | 'inactive';
    created_at: string;
    updated_at: string;
}

export interface BuildingFormData {
    name: string;
    address: string;
    description?: string;
    status?: 'active' | 'inactive';
}

export interface BuildingStatusData {
    status: 'active' | 'inactive';
}

export interface BuildingQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface BuildingListResponse {
    data: Building[];
    total: number;
    page: number;
    limit: number;
}

export type ResBuildingList = ResRequest<BuildingListResponse>;
export type ResBuilding = ResRequest<Building>;