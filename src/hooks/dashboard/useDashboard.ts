import {useQuery} from "@tanstack/react-query";
import {httpGet} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {ResDashboardStats} from "./model";

interface DoorStatusStat {
    lock_status: 'open' | 'closed';
    count: number;
}

interface DoorStatusByBuilding {
    building_id: number;
    building_name: string;
    lock_status: 'open' | 'closed';
    count: number;
}

interface WeeklyDoorActivity {
    date: string;
    total_requests: number;
    approved_requests: number;
}

interface DashboardStats {
    basicStats: {
        total_buildings: number;
        total_floors: number;
        total_doors: number;
        total_users: number;
    };
    doorStatusStats: DoorStatusStat[];
    doorStatusByBuilding: DoorStatusByBuilding[];
    weeklyDoorActivity: WeeklyDoorActivity[];
}

export const useDashboard = () => {
    return useQuery({
        queryKey: ['dashboard', 'stats'],
        queryFn: async () => {
            const resp = await httpGet({
                uri: API_ROUTES.DASHBOARD_STATS
            });
            return await resp.json() as ResDashboardStats;
        }
    });
};

export type { DashboardStats, DoorStatusStat, DoorStatusByBuilding, WeeklyDoorActivity }; 