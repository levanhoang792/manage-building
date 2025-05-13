import {ResRequest} from "../model";

export interface Door {
    id: number;
    floor_id: number;
    name: string;
    description?: string;
    door_type_id: number;
    status: 'active' | 'inactive' | 'maintenance';
    lock_status?: 'open' | 'closed';
    created_at: string;
    updated_at: string;
}

export interface DoorFormData {
    name: string;
    description?: string;
    door_type_id?: number;
    status?: 'active' | 'inactive' | 'maintenance';
}

export interface DoorStatusData {
    status: 'active' | 'inactive' | 'maintenance';
}

export interface DoorQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    door_type_id?: number;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DoorListResponse {
    data: Door[];
    total: number;
    page: number;
    limit: number;
}

export type ResDoorList = ResRequest<DoorListResponse>;
export type ResDoor = ResRequest<Door>;