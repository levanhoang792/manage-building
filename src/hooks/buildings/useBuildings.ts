import {useMutation, useQuery, useInfiniteQuery} from "@tanstack/react-query";
import {httpDelete, httpGet, httpPatch, httpPost, httpPut} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {BuildingFormData, BuildingQueryParams, BuildingStatusData, ResBuilding, ResBuildingList} from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Hook lấy danh sách tòa nhà với phân trang thông thường
export const useGetBuildings = (params?: BuildingQueryParams) => {
    return useQuery({
        queryKey: ['buildings', params],
        queryFn: async () => {
            const resp = await httpGet({
                uri: API_ROUTES.BUILDINGS,
                options: {body: JSON.stringify(params)}
            });
            return await resp.json() as ResBuildingList;
        }
    });
};

// Hook lấy danh sách tòa nhà với infinite scroll
export const useGetBuildingsInfinite = (params?: BuildingQueryParams) => {
    return useInfiniteQuery({
        queryKey: ['buildings-infinite', params],
        queryFn: async ({pageParam = 1}) => {
            const queryParams = {
                ...params,
                page: pageParam,
                limit: params?.limit || 20
            };
            const resp = await httpGet({
                uri: API_ROUTES.BUILDINGS,
                options: {body: JSON.stringify(queryParams)}
            });
            return await resp.json() as ResBuildingList;
        },
        getNextPageParam: (lastPage) => {
            if (!lastPage.data) return undefined;
            const totalPages = Math.ceil(lastPage.data.total / (lastPage.data.limit || 20));
            return lastPage.data.page < totalPages ? lastPage.data.page + 1 : undefined;
        },
        initialPageParam: 1
    });
};

// Hook lấy chi tiết tòa nhà
export const useGetBuildingDetail = (id: number | string) => {
    return useQuery({
        queryKey: ['building', id],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.BUILDING_DETAIL, {id});
            const resp = await httpGet({uri});
            return await resp.json() as ResBuilding;
        },
        enabled: !!id
    });
};

// Hook tạo tòa nhà mới
export const useCreateBuilding = () => {
    return useMutation({
        mutationFn: async (data: BuildingFormData) => {
            const resp = await httpPost({
                uri: API_ROUTES.BUILDING_CREATE,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResBuilding;
        }
    });
};

// Hook cập nhật tòa nhà
export const useUpdateBuilding = (id: number | string) => {
    return useMutation({
        mutationFn: async (data: BuildingFormData) => {
            const uri = replaceParams(API_ROUTES.BUILDING_UPDATE, {id});
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResBuilding;
        }
    });
};

// Hook cập nhật trạng thái tòa nhà
export const useUpdateBuildingStatus = (id: number | string) => {
    return useMutation({
        mutationFn: async (data: BuildingStatusData) => {
            const uri = replaceParams(API_ROUTES.BUILDING_STATUS, {id});
            const resp = await httpPatch({
                uri,
                options: {body: JSON.stringify(data)}
            });
            return await resp.json() as ResBuilding;
        }
    });
};

// Hook xóa tòa nhà
export const useDeleteBuilding = () => {
    return useMutation({
        mutationFn: async (id: number | string) => {
            const uri = replaceParams(API_ROUTES.BUILDING_DELETE, {id});
            const resp = await httpDelete({uri});
            return await resp.json();
        }
    });
};