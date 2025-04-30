import {ResRequest} from "../model";

export interface DoorCoordinate {
    id: number;
    door_id: number;
    x_coordinate: number;
    y_coordinate: number;
    z_coordinate?: number;
    rotation?: number;
    created_at: string;
    updated_at: string;
}

export interface DoorCoordinateFormData {
    x_coordinate: number;
    y_coordinate: number;
    z_coordinate?: number;
    rotation?: number;
}

export type ResDoorCoordinateList = ResRequest<DoorCoordinate[]>;
export type ResDoorCoordinate = ResRequest<DoorCoordinate>;