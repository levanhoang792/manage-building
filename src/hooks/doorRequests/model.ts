import {ResRequest} from "../model";

export interface DoorRequest {
    id: number;
    door_id: number;
    door_name: string;
    floor_id: number;
    floor_name: string;
    building_id: number;
    building_name: string;
    requester_name: string;
    requester_phone?: string;
    requester_email?: string;
    purpose: string;
    status: 'pending' | 'approved' | 'rejected';
    processed_by?: number;
    processed_by_name?: string;
    processed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface DoorRequestFormData {
    door_id: number;
    requester_name: string;
    requester_phone?: string;
    requester_email?: string;
    purpose: string;
}

export interface DoorRequestStatusData {
    status: 'approved' | 'rejected';
    reason?: string;
}

export interface DoorRequestQueryParams {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    buildingId?: number | string;
    floorId?: number | string;
    doorId?: number | string;
    startDate?: string;
    endDate?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface DoorRequestListResponse {
    data: DoorRequest[];
    total: number;
    page: number;
    limit: number;
    door?: {
        id: number;
        name: string;
    };
}

export type ResDoorRequestList = ResRequest<DoorRequestListResponse>;
export type ResDoorRequest = ResRequest<DoorRequest>;