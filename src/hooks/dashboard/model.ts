import {ResRequest} from "../model";

export interface DoorStatusStat {
    lock_status: 'open' | 'closed';
    count: number;
}

export interface DoorStatusByBuilding {
    building_id: number;
    building_name: string;
    lock_status: 'open' | 'closed';
    count: number;
}

export interface WeeklyDoorActivity {
    date: string;
    total_requests: number;
    approved_requests: number;
}

export interface HourlyActivity {
    hour: number;
    total_requests: number;
    approved_requests: number;
}

export interface TopActiveBuilding {
    building_id: number;
    building_name: string;
    total_requests: number;
    total_doors: number;
}

export interface BuildingApprovalRate {
    building_id: number;
    building_name: string;
    total_requests: number;
    approved_requests: number;
    rejected_requests: number;
    approval_rate: string;
}

export interface DashboardStats {
    basicStats: {
        total_buildings: number;
        total_floors: number;
        total_doors: number;
        total_users: number;
    };
    doorStatusStats: DoorStatusStat[];
    doorStatusByBuilding: DoorStatusByBuilding[];
    weeklyDoorActivity: WeeklyDoorActivity[];
    hourlyActivity: HourlyActivity[];
    topActiveBuildings: TopActiveBuilding[];
    buildingApprovalRates: BuildingApprovalRate[];
}

export type ResDashboardStats = ResRequest<DashboardStats>; 