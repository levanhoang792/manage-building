import { ResRequest } from "../model";

export interface Door {
  id: number;
  floor_id: number;
  name: string;
  description?: string;
  type: 'main' | 'emergency' | 'service' | 'other';
  status: 'active' | 'inactive' | 'maintenance';
  created_at: string;
  updated_at: string;
}

export interface DoorFormData {
  name: string;
  description?: string;
  type?: 'main' | 'emergency' | 'service' | 'other';
  status?: 'active' | 'inactive' | 'maintenance';
}

export interface DoorStatusData {
  status: 'active' | 'inactive' | 'maintenance';
}

export interface DoorQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
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