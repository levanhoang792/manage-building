import { useMutation, useQuery } from "@tanstack/react-query";
import { httpDelete, httpGet, httpPost, httpPut } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { 
  Floor, 
  FloorFormData, 
  FloorQueryParams, 
  FloorStatusData, 
  ResFloor, 
  ResFloorList 
} from "./model";

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
      const uri = replaceParams(API_ROUTES.FLOORS, { buildingId });
      const resp = await httpGet({
        uri,
        options: { body: JSON.stringify(params) }
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
      const uri = replaceParams(API_ROUTES.FLOOR_DETAIL, { buildingId, id });
      const resp = await httpGet({ uri });
      return await resp.json() as ResFloor;
    },
    enabled: !!buildingId && !!id
  });
};

// Hook tạo tầng mới
export const useCreateFloor = (buildingId: number | string) => {
  return useMutation({
    mutationFn: async (data: FloorFormData) => {
      const uri = replaceParams(API_ROUTES.FLOOR_CREATE, { buildingId });
      const resp = await httpPost({
        uri,
        options: { body: JSON.stringify(data) }
      });
      return await resp.json() as ResFloor;
    }
  });
};

// Hook cập nhật tầng
export const useUpdateFloor = (buildingId: number | string, id: number | string) => {
  return useMutation({
    mutationFn: async (data: FloorFormData) => {
      const uri = replaceParams(API_ROUTES.FLOOR_UPDATE, { buildingId, id });
      const resp = await httpPut({
        uri,
        options: { body: JSON.stringify(data) }
      });
      return await resp.json() as ResFloor;
    }
  });
};

// Hook cập nhật trạng thái tầng
export const useUpdateFloorStatus = (buildingId: number | string, id: number | string) => {
  return useMutation({
    mutationFn: async (data: FloorStatusData) => {
      const uri = replaceParams(API_ROUTES.FLOOR_STATUS, { buildingId, id });
      const resp = await httpPut({
        uri,
        options: { body: JSON.stringify(data) }
      });
      return await resp.json() as ResFloor;
    }
  });
};

// Hook xóa tầng
export const useDeleteFloor = (buildingId: number | string) => {
  return useMutation({
    mutationFn: async (id: number | string) => {
      const uri = replaceParams(API_ROUTES.FLOOR_DELETE, { buildingId, id });
      const resp = await httpDelete({ uri });
      return await resp.json();
    }
  });
};

// Hook upload sơ đồ tầng
export const useUploadFloorPlan = (buildingId: number | string, id: number | string) => {
  return useMutation({
    mutationFn: async (file: File) => {
      const uri = replaceParams(API_ROUTES.FLOOR_UPLOAD_PLAN, { buildingId, id });
      
      const formData = new FormData();
      formData.append('floorPlan', file);
      
      const resp = await httpPost({
        uri,
        options: { body: formData }
      });
      
      return await resp.json() as ResFloor;
    }
  });
};