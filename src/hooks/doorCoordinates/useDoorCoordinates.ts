import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {httpDelete, httpGet, httpPost, httpPut} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {DoorCoordinateFormData, ResDoorCoordinate, ResDoorCoordinateList, ResMultipleDoorCoordinates} from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Hook lấy danh sách tọa độ của cửa
export const useGetDoorCoordinates = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string
) => {
    return useQuery({
        queryKey: ['doorCoordinates', buildingId, floorId, doorId],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.DOOR_COORDINATES, {buildingId, floorId, doorId});
            const resp = await httpGet({uri});
            return await resp.json() as ResDoorCoordinateList;
        },
        enabled: !!buildingId && !!floorId && !!doorId
    });
};

// Hook lấy chi tiết tọa độ cửa
export const useGetDoorCoordinateDetail = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string,
    id: number | string
) => {
    return useQuery({
        queryKey: ['doorCoordinate', buildingId, floorId, doorId, id],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_DETAIL, {buildingId, floorId, doorId, id});
            const resp = await httpGet({uri});
            return await resp.json() as ResDoorCoordinate;
        },
        enabled: !!buildingId && !!floorId && !!doorId && !!id
    });
};

// Hook tạo tọa độ cửa mới
export const useCreateDoorCoordinate = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string
) => {
    return useMutation({
        mutationFn: async (data: DoorCoordinateFormData) => {
            const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_CREATE, {buildingId, floorId, doorId});
            const resp = await httpPost({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoorCoordinate;
        }
    });
};

// Hook cập nhật tọa độ cửa
export const useUpdateDoorCoordinate = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string,
    defaultId?: number | string
) => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: async (data: DoorCoordinateFormData) => {
            // Sử dụng ID từ data nếu có, ngược lại sử dụng defaultId
            const coordinateId = data.id || defaultId;
            
            if (!coordinateId) {
                throw new Error('Coordinate ID is required');
            }
            
            const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_UPDATE, {
                buildingId, 
                floorId, 
                doorId, 
                id: coordinateId
            });
            
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify({
                    x_coordinate: data.x_coordinate,
                    y_coordinate: data.y_coordinate,
                    z_coordinate: data.z_coordinate,
                    rotation: data.rotation
                })}
            });
            
            return await resp.json() as ResDoorCoordinate;
        },
        onSuccess: () => {
            // Invalidate related queries to refresh data
            queryClient.invalidateQueries({queryKey: ['doorCoordinates', buildingId, floorId, doorId]});
            queryClient.invalidateQueries({queryKey: ['multipleDoorCoordinates']});
        }
    });
};

// Hook xóa tọa độ cửa
export const useDeleteDoorCoordinate = (
    buildingId: number | string,
    floorId: number | string,
    doorId: number | string
) => {
    return useMutation({
        mutationFn: async (id: number | string) => {
            const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_DELETE, {buildingId, floorId, doorId, id});
            const resp = await httpDelete({uri});
            return await resp.json();
        }
    });
};

// Hook lấy tọa độ của nhiều cửa cùng lúc
export const useGetMultipleDoorCoordinates = (
    buildingId: number | string,
    floorId: number | string,
    doorIds: (number | string)[]
) => {
    const queryClient = useQueryClient();

    return useQuery<ResMultipleDoorCoordinates>({
        queryKey: ['multipleDoorCoordinates', buildingId, floorId, doorIds],
        queryFn: async () => {
            // Lấy tọa độ cho từng cửa
            const promises = doorIds.map(async (doorId) => {
                // Kiểm tra xem dữ liệu đã có trong cache chưa
                const cachedData = queryClient.getQueryData<ResDoorCoordinateList>(['doorCoordinates', buildingId, floorId, doorId]);
                if (cachedData) {
                    return {doorId, data: cachedData};
                }

                // Nếu chưa có trong cache, gọi API
                const uri = replaceParams(API_ROUTES.DOOR_COORDINATES, {buildingId, floorId, doorId});
                console.log(`Calling API for door ${doorId} with URI: ${uri}`);
                console.log(`Parameters: buildingId=${buildingId}, floorId=${floorId}, doorId=${doorId}`);
                const resp = await httpGet({uri});
                const data = await resp.json() as ResDoorCoordinateList;

                // Lưu vào cache
                queryClient.setQueryData(['doorCoordinates', buildingId, floorId, doorId], data);

                return {doorId, data};
            });

            return Promise.all(promises);
        },
        enabled: !!buildingId && !!floorId && doorIds.length > 0
    });
};