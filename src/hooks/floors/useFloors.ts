import {useMutation, useQuery} from "@tanstack/react-query";
import {httpDelete, httpGet, httpPatch, httpPost, httpPut} from "@/utils/api";
import {API_ROUTES} from "@/routes/api";
import {FloorFormData, FloorQueryParams, ResFloor, ResFloorList} from "./model";

// Hàm helper để thay thế các tham số trong URL
const replaceParams = (url: string, params: Record<string, string | number>) => {
    let result = url;
    Object.entries(params).forEach(([key, value]) => {
        result = result.replace(`:${key}`, String(value));
    });
    return result;
};

// Hook lấy danh sách tầng của tòa nhà
export const useGetFloors = (buildingId: number | string, params?: FloorQueryParams) => {
    return useQuery({
        queryKey: ['floors', buildingId, params],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.FLOORS, {id: buildingId});
            const resp = await httpGet({
                uri,
                options: {body: JSON.stringify(params)}
            });
            return await resp.json() as ResFloorList;
        },
        enabled: !!buildingId
    });
};

// Hook lấy chi tiết tầng
export const useGetFloorDetail = (buildingId: number | string, id: number | string) => {
    return useQuery({
        queryKey: ['floor', buildingId, id],
        queryFn: async () => {
            const uri = replaceParams(API_ROUTES.FLOOR_DETAIL, {id: buildingId, floorId: id});
            const resp = await httpGet({uri});
            return await resp.json() as ResFloor;
        },
        enabled: !!buildingId && !!id
    });
};

// Hook tạo tầng mới
export const useCreateFloor = (buildingId: number | string) => {
    return useMutation({
        mutationFn: async (data: FloorFormData) => {
            // Đảm bảo rằng tham số trùng khớp với tham số trong API_ROUTES
            const uri = replaceParams(API_ROUTES.FLOOR_CREATE, {id: buildingId});

            // Tách file floor plan ra khỏi data
            const {floorPlan, ...floorData} = data;

            console.log('Creating floor with URI:', uri, 'and data:', floorData);

            // Tạo tầng mới trước
            const resp = await httpPost({
                uri,
                options: {body: JSON.stringify(floorData)}
            });

            const result = await resp.json() as ResFloor;
            console.log('Create floor response:', result);

            // Nếu có file floor plan, upload sau khi tạo tầng
            if (floorPlan) {
                const floorId = result.data.id;
                const uploadUri = replaceParams(API_ROUTES.FLOOR_UPLOAD_PLAN, {id: buildingId, floorId});

                const formData = new FormData();
                formData.append('floorPlan', floorPlan);

                console.log('Uploading floor plan to:', uploadUri);

                const uploadResp = await httpPost({
                    uri: uploadUri,
                    options: {body: formData}
                });

                const uploadResult = await uploadResp.json() as ResFloor;
                console.log('Upload floor plan response:', uploadResult);

                return uploadResult;
            }

            return result;
        }
    });
};

// Hook cập nhật tầng
export const useUpdateFloor = (buildingId: number | string, id: number | string) => {
    return useMutation({
        mutationFn: async (data: FloorFormData) => {
            const uri = replaceParams(API_ROUTES.FLOOR_UPDATE, {id: buildingId, floorId: id});

            // Tách file floor plan ra khỏi data
            const {floorPlan, ...floorData} = data;

            // Cập nhật thông tin tầng trước
            const resp = await httpPut({
                uri,
                options: {body: JSON.stringify(floorData)}
            });

            const result = await resp.json() as ResFloor;

            // Nếu có file floor plan, upload sau khi cập nhật tầng
            if (floorPlan) {
                const uploadUri = replaceParams(API_ROUTES.FLOOR_UPLOAD_PLAN, {id: buildingId, floorId: id});

                const formData = new FormData();
                formData.append('floorPlan', floorPlan);

                const uploadResp = await httpPost({
                    uri: uploadUri,
                    options: {body: formData}
                });

                return await uploadResp.json() as ResFloor;
            }

            return result;
        }
    });
};

// Hook cập nhật trạng thái tầng
export const useUpdateFloorStatus = (buildingId: number | string) => {
    return useMutation({
        mutationFn: async ({floorId, status}: { floorId: number | string, status: 'active' | 'inactive' }) => {
            const uri = replaceParams(API_ROUTES.FLOOR_STATUS, {id: buildingId, floorId});
            const resp = await httpPatch({
                uri,
                options: {body: JSON.stringify({status})}
            });
            return await resp.json() as ResFloor;
        }
    });
};

// Hook xóa tầng
export const useDeleteFloor = (buildingId: number | string) => {
    return useMutation({
        mutationFn: async (id: number | string) => {
            const uri = replaceParams(API_ROUTES.FLOOR_DELETE, {id: buildingId, floorId: id});
            const resp = await httpDelete({uri});
            return await resp.json();
        }
    });
};

// Hook upload sơ đồ tầng
export const useUploadFloorPlan = (buildingId: number | string) => {
    return useMutation({
        mutationFn: async ({floorId, file}: { floorId: number | string, file: File }) => {
            const uri = replaceParams(API_ROUTES.FLOOR_UPLOAD_PLAN, {id: buildingId, floorId});

            const formData = new FormData();
            formData.append('floorPlan', file);

            const resp = await httpPost({
                uri,
                options: {body: formData}
            });

            return await resp.json() as ResFloor;
        }
    });
};