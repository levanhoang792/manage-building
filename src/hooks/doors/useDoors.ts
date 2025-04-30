import {useMutation, useQuery} from "@tanstack/react-query";
import {httpDelete, httpGet, httpPost, httpPut} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {DoorFormData, DoorQueryParams, DoorStatusData, ResDoor, ResDoorList} from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Hook lấy danh sách cửa của tầng
export const useGetDoors = (
    buildingId: number | string,
    floorId: number | string,
    params?: DoorQueryParams
) => {
    return useQuery({
        queryKey: ['doors', buildingId, floorId, params],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.DOORS, {buildingId, floorId});
            const resp = await httpGet({
                uri,
                options: {body: JSON.stringify(params)}
            });
            return await resp.json() as ResDoorList;
        },
        enabled: !!buildingId && !!floorId
    });
};

// Hook lấy chi tiết cửa
export const useGetDoorDetail = (
    buildingId: number | string,
    floorId: number | string,
    id: number | string
) => {
    return useQuery({
        queryKey: ['door', buildingId, floorId, id],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.DOOR_DETAIL, {buildingId, floorId, id});
            const resp = await httpGet({uri});
            return await resp.json() as ResDoor;
        },
        enabled: !!buildingId && !!floorId && !!id
    });
};

// Hook tạo cửa mới
export const useCreateDoor = (buildingId: number | string, floorId: number | string) => {
    return useMutation({
        mutationFn: async (data: DoorFormData) => {
            const uri = replaceParams(API_ROUTES.DOOR_CREATE, {buildingId, floorId});
            const resp = await httpPost({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoor;
        }
    });
};

// Hook cập nhật cửa
export const useUpdateDoor = (
    buildingId: number | string,
    floorId: number | string,
    id: number | string
) => {
    return useMutation({
        mutationFn: async (data: DoorFormData) => {
            const uri = replaceParams(API_ROUTES.DOOR_UPDATE, {buildingId, floorId, id});
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoor;
        }
    });
};

// Hook cập nhật trạng thái cửa
export const useUpdateDoorStatus = (
    buildingId: number | string,
    floorId: number | string,
    id: number | string
) => {
    return useMutation({
        mutationFn: async (data: DoorStatusData) => {
            const uri = replaceParams(API_ROUTES.DOOR_STATUS, {buildingId, floorId, id});
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResDoor;
        }
    });
};

// Hook xóa cửa
export const useDeleteDoor = (buildingId: number | string, floorId: number | string) => {
    return useMutation({
        mutationFn: async (id: number | string) => {
            const uri = replaceParams(API_ROUTES.DOOR_DELETE, {buildingId, floorId, id});
            const resp = await httpDelete({uri});
            return await resp.json();
        }
    });
};