import { useMutation, useQuery } from "@tanstack/react-query";
import { httpDelete, httpGet, httpPost, httpPut } from "@/utils/api";
import { API_ROUTES } from "@/routes/api";
import { 
  DoorCoordinate, 
  DoorCoordinateFormData, 
  ResDoorCoordinate, 
  ResDoorCoordinateList 
} from "./model";

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
      const uri = replaceParams(API_ROUTES.DOOR_COORDINATES, { buildingId, floorId, doorId });
      const resp = await httpGet({ uri });
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
      const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_DETAIL, { buildingId, floorId, doorId, id });
      const resp = await httpGet({ uri });
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
      const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_CREATE, { buildingId, floorId, doorId });
      const resp = await httpPost({
        uri,
        options: { body: JSON.stringify(data) }
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
  id: number | string
) => {
  return useMutation({
    mutationFn: async (data: DoorCoordinateFormData) => {
      const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_UPDATE, { buildingId, floorId, doorId, id });
      const resp = await httpPut({
        uri,
        options: { body: JSON.stringify(data) }
      });
      return await resp.json() as ResDoorCoordinate;
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
      const uri = replaceParams(API_ROUTES.DOOR_COORDINATE_DELETE, { buildingId, floorId, doorId, id });
      const resp = await httpDelete({ uri });
      return await resp.json();
    }
  });
};