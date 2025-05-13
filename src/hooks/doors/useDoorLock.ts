import { useMutation, useQuery } from "@tanstack/react-query";
import { httpGet, httpPut } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { ResDoor } from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Interface cho dữ liệu cập nhật khóa cửa
export interface DoorLockStatusData {
    lock_status: 'open' | 'closed';
    reason?: string;
}

// Hook cập nhật trạng thái khóa cửa
export const useUpdateDoorLockStatus = (
    buildingId: number | string,
    floorId: number | string,
    id: number | string
) => {
    return useMutation({
        mutationFn: async (data: DoorLockStatusData) => {
            // Sử dụng endpoint cho việc cập nhật trạng thái khóa
            const uri = replaceParams(API_ROUTES.DOOR_LOCK_UPDATE, {buildingId, floorId, id});
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoor;
        }
    });
};

// Hook lấy lịch sử đóng/mở khóa cửa
export interface DoorLockHistoryItem {
    id: number;
    door_id: number;
    previous_status: 'open' | 'closed';
    new_status: 'open' | 'closed';
    changed_by?: number;
    changed_by_name?: string;
    request_id?: number;
    reason?: string;
    created_at: string;
}

export interface DoorLockHistoryResponse {
    data: DoorLockHistoryItem[];
    total: number;
    page: number;
    limit: number;
}

export const useGetDoorLockHistory = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string,
    params?: {
        page?: number;
        limit?: number;
        startDate?: string;
        endDate?: string;
    }
) => {
    return useQuery({
        queryKey: ['doorLockHistory', buildingId, floorId, doorId, params],
        queryFn: async () => {
            // Lọc bỏ các tham số undefined hoặc null
            const filteredParams = params ? Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== undefined && v !== null && v !== '')
            ) : {};
            
            // Chuyển đổi các tham số số thành số
            if (filteredParams.page) filteredParams.page = Number(filteredParams.page);
            if (filteredParams.limit) filteredParams.limit = Number(filteredParams.limit);
            
            // Sử dụng URLSearchParams thay vì JSON
            const queryParams = new URLSearchParams();
            Object.entries(filteredParams).forEach(([key, value]) => {
                queryParams.append(key, String(value));
            });
            
            const baseUri = replaceParams(API_ROUTES.DOOR_LOCK_HISTORY, {
                buildingId, 
                floorId, 
                id: doorId
            });
            const queryString = queryParams.toString();
            const uri = `${baseUri}${queryString ? `?${queryString}` : ''}`;
            
            const resp = await httpGet({ uri });
            return await resp.json() as { data: DoorLockHistoryResponse };
        },
        enabled: !!buildingId && !!floorId && !!doorId
    });
};