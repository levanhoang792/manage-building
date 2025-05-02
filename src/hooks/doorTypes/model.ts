/**
 * Response interface for door types API
 */
export interface ResDoorTypes {
    doorTypes: DoorType[];
}

/**
 * Door type interface matching the database schema
 */
export interface DoorType {
    id: number;
    name: string;
    description?: string;
    created_at?: string;
    updated_at?: string;
}

/**
 * Interface for creating a new door type
 */
export interface CreateDoorTypeDto {
    name: string;
    description?: string;
}

/**
 * Interface for updating an existing door type
 */
export interface UpdateDoorTypeDto extends CreateDoorTypeDto {
    id: number;
}