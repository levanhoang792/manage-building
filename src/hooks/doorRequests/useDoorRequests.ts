import {useMutation, useQuery} from "@tanstack/react-query";
import {httpGet, httpPost, httpPut} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {
    DoorRequestFormData,
    DoorRequestQueryParams,
    DoorRequestStatusData,
    ResDoorRequest,
    ResDoorRequestList
} from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Hook lấy danh sách tất cả yêu cầu mở cửa
export const useGetAllDoorRequests = (params?: DoorRequestQueryParams) => {
    return useQuery({
        queryKey: ['doorRequests', params],
        queryFn: async () => {
            try {
                // Lọc bỏ các tham số undefined hoặc null
                const filteredParams = params ? Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
                ) : {};

                // Chuyển đổi các tham số số thành số
                if (filteredParams.page) filteredParams.page = Number(filteredParams.page);
                if (filteredParams.limit) filteredParams.limit = Number(filteredParams.limit);
                if (filteredParams.buildingId) filteredParams.buildingId = Number(filteredParams.buildingId);
                if (filteredParams.floorId) filteredParams.floorId = Number(filteredParams.floorId);
                if (filteredParams.doorId) filteredParams.doorId = Number(filteredParams.doorId);

                // Sử dụng URLSearchParams thay vì JSON
                const queryParams = new URLSearchParams();
                Object.entries(filteredParams).forEach(([key, value]) => {
                    queryParams.append(key, String(value));
                });

                const queryString = queryParams.toString();
                const uri = `${API_ROUTES.DOOR_REQUESTS}${queryString ? `?${queryString}` : ''}`;

                const resp = await httpGet({uri});
                return await resp.json() as ResDoorRequestList;
            } catch (error) {
                console.error('Error fetching door requests:', error);
                throw error;
            }
        },
        // Thêm cấu hình để tránh gọi lại liên tục
        refetchOnWindowFocus: false,
        staleTime: 30000 // 30 giây
    });
};

// Hook lấy chi tiết yêu cầu mở cửa
export const useGetDoorRequestDetail = (id: number | string) => {
    return useQuery({
        queryKey: ['doorRequest', id],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.DOOR_REQUEST_DETAIL, {id});
            const resp = await httpGet({uri});
            return await resp.json() as ResDoorRequest;
        },
        enabled: !!id,
        refetchOnWindowFocus: false,
        staleTime: 30000 // 30 giây
    });
};

// Hook tạo yêu cầu mở cửa mới
export const useCreateDoorRequest = () => {
    return useMutation({
        mutationFn: async (data: DoorRequestFormData) => {
            console.log('Creating door request with data:', data);

            // Đảm bảo door_id là số
            const doorId = data.door_id;

            const requestData = {
                ...data,
                door_id: doorId
            };

            console.log('Sending request data:', requestData);

            const resp = await httpPost({
                uri: API_ROUTES.DOOR_REQUEST_CREATE,
                options: {body: JSON.stringify(requestData)}
            });
            return await resp.json() as ResDoorRequest;
        }
    });
};

// Hook cập nhật trạng thái yêu cầu mở cửa
export const useUpdateDoorRequestStatus = (id: number | string) => {
    return useMutation({
        mutationFn: async (data: DoorRequestStatusData) => {
            const uri = replaceParams(API_ROUTES.DOOR_REQUEST_UPDATE_STATUS, {id});
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoorRequest;
        }
    });
};

// Hook lấy danh sách yêu cầu mở cửa cho một cửa cụ thể
export const useGetDoorRequestsByDoor = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string,
    params?: DoorRequestQueryParams
) => {
    return useQuery({
        queryKey: ['doorRequestsByDoor', buildingId, floorId, doorId, params],
        queryFn: async () => {
            try {
                // Lọc bỏ các tham số undefined hoặc null
                const filteredParams = params ? Object.fromEntries(
                    Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
                ) : {};

                // Chuyển đổi các tham số số thành số
                if (filteredParams.page) filteredParams.page = Number(filteredParams.page);
                if (filteredParams.limit) filteredParams.limit = Number(filteredParams.limit);

                // Sử dụng URLSearchParams thay vì JSON
                const queryParams = new URLSearchParams();
                Object.entries(filteredParams).forEach(([key, value]) => {
                    queryParams.append(key, String(value));
                });

                const baseUri = replaceParams(API_ROUTES.DOOR_REQUEST_BY_DOOR, {
                    buildingId,
                    floorId,
                    id: doorId
                });
                const queryString = queryParams.toString();
                const uri = `${baseUri}${queryString ? `?${queryString}` : ''}`;

                const resp = await httpGet({uri});
                return await resp.json() as ResDoorRequestList;
            } catch (error) {
                console.error('Error fetching door requests by door:', error);
                throw error;
            }
        },
        enabled: !!buildingId && !!floorId && !!doorId,
        refetchOnWindowFocus: false,
        staleTime: 30000 // 30 giây
    });
};

interface DoorRequestStatusResponse {
    success: boolean;
    data: {
        hasPendingRequest: boolean;
        requestDetails: {
            id: number;
            requester_name: string;
            created_at: string;
        } | null;
    };
}

export const useGetDoorRequestStatus = (buildingId?: string, floorId?: string, doorId?: string) => {
    return useQuery<DoorRequestStatusResponse>({
        queryKey: ['doorRequestStatus', buildingId, floorId, doorId],
        queryFn: async () => {
            try {
                const uri = replaceParams(API_ROUTES.DOOR_REQUEST_STATUS, {
                    buildingId: buildingId || '',
                    floorId: floorId || '',
                    doorId: doorId || ''
                });
                const resp = await httpGet({uri});
                return await resp.json();
            } catch (error) {
                console.error('Error checking door request status:', error);
                throw error;
            }
        },
        enabled: !!buildingId && !!floorId && !!doorId,
        refetchInterval: 5000, // Refetch every 5 seconds
    });
};